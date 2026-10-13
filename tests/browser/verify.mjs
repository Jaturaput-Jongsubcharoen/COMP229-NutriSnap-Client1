import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { loadEnv } from 'vite';

// Start Vite and a separate Chrome profile with --remote-debugging-port=9222.
// All non-local requests are intercepted; this suite never changes real user data.
const origin = process.env.NUTRISNAP_BROWSER_URL || 'http://127.0.0.1:5173';
const env = loadEnv('development', process.cwd(), 'VITE_');
const backend = env.VITE_BE_URL;
const target = await (
  await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' })
).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});
let sequence = 0;
const pending = new Map();
const failures = [];
const requests = [];
const exceptions = [];
let entries = [
  {
    _id: 'seed-1',
    name: 'Grilled chicken bowl',
    calories: '520',
    protein: '42',
    carbohydrates: '55',
    fat: '14',
    mealType: 'Lunch',
  },
];
const food = {
  food_name: 'Banana',
  nf_calories: 105,
  nf_protein: 1.3,
  nf_total_carbohydrate: 27,
  nf_total_fat: 0.4,
};
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error('CDP timeout: ' + method));
    }, 20000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function mockRequest({ requestId, request }) {
  if (
    request.url.startsWith(origin) ||
    request.url.startsWith('data:') ||
    request.url.startsWith('blob:')
  ) {
    await send('Fetch.continueRequest', { requestId });
    return;
  }
  let status = 200;
  let body = {};
  const url = new URL(request.url);
  const payload = request.postData ? JSON.parse(request.postData) : null;
  if (request.method === 'OPTIONS') {
    await send('Fetch.fulfillRequest', {
      requestId,
      responseCode: 204,
      responseHeaders: [
        { name: 'Access-Control-Allow-Origin', value: origin },
        {
          name: 'Access-Control-Allow-Methods',
          value: 'GET, POST, DELETE, OPTIONS',
        },
        { name: 'Access-Control-Allow-Headers', value: '*' },
      ],
    });
    return;
  }
  requests.push({
    path: url.pathname,
    method: request.method,
    payload,
    headers: request.headers,
  });
  if (request.url.startsWith(backend)) {
    if (url.pathname === '/login') {
      if (payload.username === 'invalid') {
        status = 401;
        body = 'Invalid credentials';
      } else
        body = { token: 'browser-test-token', userID: 'browser-test-user' };
    } else if (url.pathname === '/register') body = { message: 'Registered' };
    else if (url.pathname === '/getUser') body = { username: 'Athlete' };
    else if (url.pathname === '/apiMongo') body = { items: entries };
    else if (url.pathname === '/nutrients') {
      if (payload.name === 'FAIL') {
        status = 500;
        body = 'Test save failure';
      } else {
        body = { ...payload, _id: 'test-' + requests.length };
        entries.push(body);
      }
    } else if (
      url.pathname.startsWith('/apiMongo/') &&
      request.method === 'DELETE'
    ) {
      entries = entries.filter(
        (entry) => entry._id !== url.pathname.split('/').at(-1)
      );
      body = {};
    } else {
      status = 404;
      body = 'Unexpected backend request';
    }
  } else if (url.hostname === 'trackapi.nutritionix.com')
    body = { foods: [food] };
  else if (url.hostname === 'generativelanguage.googleapis.com') {
    body = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: 'Estimated nutrition: 120 kcal, 3g protein, 20g carbohydrates, 2g fat. Review before saving.',
              },
            ],
            role: 'model',
          },
          finishReason: 'STOP',
        },
      ],
    };
  } else {
    status = 503;
    body = 'External request blocked by verification suite';
  }
  await send('Fetch.fulfillRequest', {
    requestId,
    responseCode: status,
    responseHeaders: [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Access-Control-Allow-Origin', value: origin },
      { name: 'Access-Control-Allow-Headers', value: '*' },
    ],
    body: Buffer.from(
      typeof body === 'string' ? body : JSON.stringify(body)
    ).toString('base64'),
  });
}
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const item = pending.get(message.id);
    if (!item) return;
    clearTimeout(item.timer);
    pending.delete(message.id);
    if (message.error) item.reject(new Error(message.error.message));
    else item.resolve(message.result);
  } else if (message.method === 'Fetch.requestPaused') {
    mockRequest(message.params).catch((error) => failures.push(error.message));
  } else if (message.method === 'Runtime.exceptionThrown') {
    exceptions.push(
      message.params.exceptionDetails.exception?.description ||
        message.params.exceptionDetails.text
    );
  }
};
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails)
    throw new Error(
      result.exceptionDetails.exception?.description ||
        result.exceptionDetails.text
    );
  return result.result.value;
}
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitFor(expression, label, timeout = 12000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (await evaluate('Boolean(' + expression + ')')) return;
    await pause(80);
  }
  throw new Error('Timed out: ' + label);
}
async function go(path) {
  await send('Page.navigate', { url: origin + path });
  await waitFor('document.querySelector("main h1") !== null', path);
  await pause(100);
}
async function field(selector, value) {
  await evaluate(
    `(() => { const node = document.querySelector(${JSON.stringify(selector)}); const proto = node.tagName === 'SELECT' ? HTMLSelectElement.prototype : node.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(node, ${JSON.stringify(value)}); node.dispatchEvent(new Event('input', { bubbles:true })); node.dispatchEvent(new Event('change', { bubbles:true })); })()`
  );
}
async function click(selector) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
}
async function screenshot(name) {
  await pause(250);
  const result = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });
  await writeFile(
    'tests/robot/artifacts/' + name + '.png',
    Buffer.from(result.data, 'base64')
  );
}
async function check(label, task) {
  try {
    await task();
    console.log('PASS ' + label);
  } catch (error) {
    failures.push(label + ': ' + error.message);
    console.log('FAIL ' + label + ': ' + error.message);
    console.log(
      'Recent request paths:',
      requests.slice(-3).map((item) => item.method + ' ' + item.path)
    );
    console.log(
      'Visible errors:',
      await evaluate(
        'Array.from(document.querySelectorAll("[role=alert]")).map(node => node.textContent)'
      ).catch(() => [])
    );
  }
}
await mkdir('tests/robot/artifacts', { recursive: true });
try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await go('/');
  await evaluate('localStorage.clear()');
  await go('/login');
  await check('empty login rejected by native validation', async () => {
    await click('form button[type="submit"]');
    assert.equal(await evaluate('location.pathname'), '/login');
    assert.equal(
      await evaluate('document.querySelector("form").checkValidity()'),
      false
    );
  });
  await check(
    'invalid login feedback and valid login session/redirect',
    async () => {
      await field('#login-username', 'invalid');
      await field('#login-password', 'test-password');
      await click('form button[type="submit"]');
      await waitFor(
        'document.querySelector("[role=alert]")?.textContent.includes("Invalid credentials")',
        'login error'
      );
      await field('#login-username', 'Athlete');
      await click('form button[type="submit"]');
      await waitFor(
        'location.pathname === "/main-page" && document.body.textContent.includes("Athlete")',
        'login redirect'
      );
      assert.equal(
        await evaluate('localStorage.getItem("token")'),
        'browser-test-token'
      );
      assert.equal(
        await evaluate('localStorage.getItem("userID")'),
        'browser-test-user'
      );
      await waitFor(
        'document.querySelector(".hero-number")?.textContent.includes("520")',
        'dashboard total'
      );
    }
  );
  await check(
    'manual save retains failed values and records only successful saves',
    async () => {
      await go('/add-item');
      await field('input[name=name]', 'FAIL');
      await field('input[name=calories]', '120');
      await field('input[name=protein]', '3');
      await field('input[name=carbohydrates]', '20');
      await field('input[name=fat]', '2');
      await field('select[name=mealType]', 'Breakfast');
      await click('form button[type=submit]');
      await waitFor(
        'document.querySelector("[role=alert]")?.textContent.includes("Test save failure")',
        'failed save'
      );
      assert.equal(
        await evaluate('document.querySelector("input[name=name]").value'),
        'FAIL'
      );
      assert.equal(
        await evaluate(
          'document.querySelectorAll(".session-list .nutrition-card").length'
        ),
        0
      );
      await field('input[name=name]', 'Oats');
      await click('form button[type=submit]');
      await waitFor(
        'document.querySelector(".session-list")?.textContent.includes("Oats")',
        'successful save'
      );
      assert.equal(
        await evaluate('document.querySelector("input[name=name]").value'),
        ''
      );
    }
  );
  await check('Nutritionix search and explicit Dinner save', async () => {
    await go('/text-search');
    await field('#food-query', '1 banana');
    await click('form button');
    await waitFor(
      'document.querySelector(".nutrition-card")?.textContent.includes("Banana")',
      'nutrition result'
    );
    await click('.nutrition-card button');
    await waitFor(
      'document.querySelector("[role=status]")?.textContent.includes("Saved to history")',
      'result saved'
    );
    assert.equal(
      await evaluate('document.querySelectorAll(".nutrition-card").length'),
      2
    );
    const request = requests
      .filter((item) => item.path === '/nutrients')
      .at(-1);
    assert.deepEqual(request.payload, {
      name: 'Banana',
      calories: '105',
      protein: '1.3',
      carbohydrates: '27',
      fat: '0.4',
      mealType: 'Dinner',
    });
  });
  await check('barcode image decoding and product lookup', async () => {
    await go('/barcode');
    await evaluate(`(() => {
      const L=['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
      const G=['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
      const R=L.map(s=>s.replace(/[01]/g,c=>c==='0'?'1':'0'));
      const code='5901234123457', parity='LGGLLG';
      const bits='101'+code.slice(1,7).split('').map((d,i)=>(parity[i]==='L'?L:G)[+d]).join('')+'01010'+code.slice(7).split('').map(d=>R[+d]).join('')+'101';
      const canvas=document.createElement('canvas'); canvas.width=600; canvas.height=240;
      const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,600,240);ctx.fillStyle='#000';
      bits.split('').forEach((bit,i)=>{if(bit==='1')ctx.fillRect(60+i*5,25,5,190)});
      const data=atob(canvas.toDataURL('image/png').split(',')[1]); const bytes=Uint8Array.from(data,c=>c.charCodeAt(0));
      const transfer=new DataTransfer(); transfer.items.add(new File([bytes],'ean13.png',{type:'image/png'}));
      const input=document.querySelector('#barcode-image');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));
    })()`);
    await waitFor(
      '!document.querySelector(".panel > button").disabled',
      'barcode enabled'
    );
    await click('.panel > button');
    await waitFor(
      'document.querySelector(".nutrition-card")?.textContent.includes("Banana")',
      'barcode lookup',
      20000
    );
    assert.ok(requests.some((item) => item.path === '/v2/search/item'));
  });
  await check(
    'AI estimate is labeled and manually confirmed before save',
    async () => {
      await go('/predict-image');
      await field('#estimate-input', 'A bowl of soup');
      await click('form button');
      await waitFor(
        'document.querySelector(".estimate-text") || document.querySelector("[role=alert]")',
        'AI result'
      );
      if (await evaluate('Boolean(document.querySelector(".estimate-text"))')) {
        assert.ok(
          await evaluate(
            'document.body.textContent.includes("REVIEW REQUIRED")'
          )
        );
        assert.equal(
          await evaluate(
            'document.querySelector("input[name=calories]").value'
          ),
          ''
        );
      } else
        assert.ok(
          await evaluate(
            'document.querySelector("[role=alert]").textContent.includes("not configured")'
          )
        );
    }
  );
  await check(
    'delete dialog traps focus, cancels, and removes only after confirmation',
    async () => {
      await go('/history');
      await waitFor(
        'document.querySelector(".nutrition-card button")',
        'history'
      );
      await click('.nutrition-card button');
      assert.equal(
        await evaluate('document.querySelector("dialog").open'),
        true
      );
      assert.equal(
        await evaluate('document.activeElement.textContent'),
        'Keep entry'
      );
      for (let index = 0; index < 3; index++) {
        await send('Input.dispatchKeyEvent', {
          type: 'keyDown',
          key: 'Tab',
          code: 'Tab',
          windowsVirtualKeyCode: 9,
          nativeVirtualKeyCode: 9,
        });
        await send('Input.dispatchKeyEvent', {
          type: 'keyUp',
          key: 'Tab',
          code: 'Tab',
          windowsVirtualKeyCode: 9,
          nativeVirtualKeyCode: 9,
        });
        assert.equal(
          await evaluate(
            'document.querySelector("dialog").contains(document.activeElement)'
          ),
          true
        );
      }
      await send('Input.dispatchKeyEvent', {
        type: 'keyDown',
        key: 'Escape',
        code: 'Escape',
        windowsVirtualKeyCode: 27,
        nativeVirtualKeyCode: 27,
      });
      await send('Input.dispatchKeyEvent', {
        type: 'keyUp',
        key: 'Escape',
        code: 'Escape',
        windowsVirtualKeyCode: 27,
        nativeVirtualKeyCode: 27,
      });
      await waitFor(
        '!document.querySelector("dialog").open',
        'dialog cancelled'
      );
      const count = await evaluate(
        'document.querySelectorAll(".nutrition-card").length'
      );
      await click('.nutrition-card button');
      await click('dialog .danger');
      await waitFor(
        '!document.querySelector("dialog").open',
        'confirmed removal'
      );
      assert.equal(
        await evaluate('document.querySelectorAll(".nutrition-card").length'),
        count - 1
      );
    }
  );
  await check('theme persistence and system preference updates', async () => {
    await field('.theme-control select', 'dark');
    await go('/');
    assert.equal(
      await evaluate('document.documentElement.dataset.theme'),
      'dark'
    );
    await field('.theme-control select', 'light');
    await waitFor(
      'document.documentElement.dataset.theme === "light"',
      'light theme'
    );
    await screenshot('dashboard-light-desktop');
    await field('.theme-control select', 'system');
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-color-scheme', value: 'dark' }],
    });
    await waitFor(
      'document.documentElement.dataset.theme === "dark"',
      'system theme'
    );
    await screenshot('dashboard-dark-desktop');
  });
  const widths = process.argv.includes('--workflows-only')
    ? []
    : [
        320, 360, 375, 390, 430, 540, 600, 768, 820, 1024, 1280, 1440, 1920,
        2560,
      ];
  const paths = [
    '/',
    '/login',
    '/register',
    '/text-search',
    '/barcode',
    '/predict-image',
    '/add-item',
    '/history',
  ];
  let layouts = 0;
  for (const theme of ['dark', 'light']) {
    await field('.theme-control select', theme);
    for (const width of widths) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height: width < 600 ? 844 : 1000,
        deviceScaleFactor: 1,
        mobile: false,
      });
      for (const path of paths) {
        await go(path);
        const metrics = await evaluate(
          '({ width: innerWidth, scroll: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight })'
        );
        if (metrics.scroll > metrics.width + 1)
          failures.push(
            `Overflow: ${theme} ${width}px ${path}: ${metrics.scroll}`
          );
        layouts++;
      }
      console.log(`LAYOUT ${theme} ${width}px: 8 routes checked`);
    }
  }
  await send('Emulation.setDeviceMetricsOverride', {
    width: 844,
    height: 390,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await go('/barcode');
  assert.equal(
    await evaluate('document.documentElement.scrollWidth <= innerWidth'),
    true
  );
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await go('/');
  await field('.theme-control select', 'dark');
  await screenshot('dashboard-dark-mobile');
  await check('long names and large values wrap at 320px', async () => {
    entries.push({
      _id: 'edge',
      name: 'VeryLongFoodName'.repeat(20),
      calories: '123456789012345',
      protein: '123456789',
      carbohydrates: '987654321',
      fat: '123456789',
      mealType: 'Dinner',
    });
    await send('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 844,
      deviceScaleFactor: 1,
      mobile: false,
    });
    for (const path of ['/', '/history']) {
      await go(path);
      await waitFor(
        'document.querySelector(".nutrition-card")',
        'edge entries'
      );
      assert.equal(
        await evaluate('document.documentElement.scrollWidth <= innerWidth'),
        true
      );
      assert.equal(
        await evaluate(
          'Array.from(document.querySelectorAll(".nutrition-card")).every(node => node.scrollWidth <= node.clientWidth + 1)'
        ),
        true
      );
    }
    entries = entries.filter((entry) => entry._id !== 'edge');
  });
  await go('/');
  await check(
    'logout clears both session keys and preserves existing URL',
    async () => {
      await evaluate(
        'Array.from(document.querySelectorAll("header button")).find(node => node.textContent === "Logout").click()'
      );
      await waitFor('location.pathname === "/MainPage"', 'logout');
      assert.equal(await evaluate('localStorage.getItem("token")'), null);
      assert.equal(await evaluate('localStorage.getItem("userID")'), null);
    }
  );
  await check(
    'registration and unknown URL preserve navigation behavior',
    async () => {
      await go('/register');
      await field('#register-username', 'NewUser');
      await field('#register-email', 'new@example.test');
      await field('#register-password', 'test-password');
      await click('form button');
      await waitFor('location.pathname === "/login"', 'registration redirect');
      await go('/unknown-link');
      assert.ok(
        await evaluate(
          'document.querySelector("main h1").textContent.includes("fuel")'
        )
      );
    }
  );
  assert.deepEqual(exceptions, []);
  const report = {
    layouts,
    orientations: ['portrait', 'landscape'],
    themes: ['dark', 'light'],
    failures,
    consoleExceptions: exceptions,
    requests: requests.map(({ path, method }) => ({ path, method })),
  };
  await writeFile(
    process.argv.includes('--workflows-only')
      ? 'tests/robot/artifacts/browser-workflows-report.json'
      : 'tests/robot/artifacts/browser-report.json',
    JSON.stringify(report, null, 2)
  );
  console.log(
    `Verified ${layouts} route/viewport/theme combinations. Failures: ${failures.length}`
  );
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  }
} finally {
  await send('Page.close').catch(() => {});
  socket.close();
}
