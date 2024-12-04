# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Additional Packages to install:
npm install
npm install dotenv
npm install @google/generative-ai

First Update:
##(Renamed) Project Name: Nutri-Kcal
##Description A web application that helps users track their food macros through AI and Nutrition API estimates.

#Features
Functional Requirements:
- User Authentication: Users can sign up, and log in to application. (Changes be done later once application works as intended)

- Scan Barcode: Scan barcode, retrieve information of product from barcode API.(Currently in the works)

- Ability to retrieve and display information to user desired information (from one API and another API). Using a barcode API to retreive information of selected data points to be used (like product name, brand) to query in Nutrition API. It also shows user information about the product from product name, brand and nutrional factors.

- Nutritional Information Retrieval: After identifying the food, the app will use a nutritional database API (e.g., Nutritionix or USDA API) to fetch and display detailed nutritional information such as calories, fats, proteins, vitamins, etc.

- Store User Data: Save users’ search history (past foods entries) in MongoDB.

- Custom Food Entries: Allow users to manually enter food items and store that informations,

Stretch Goals:
- Responsive Design: Ensure the application works well on mobile and desktop devices. Update 1: No changes made yet as features in development. 

- Image Transcription Using AI: The application will send the image to an AI model (e.g., a cloud-based service like Google Cloud Vision or a custom-trained model) to identify and transcribe the food item from the picture. -Update 1: Currently working for text entries.

- Meal Planner: Based on the nutritional data, suggest meal plans for users according to their dietary needs.
- Dietary Recommendations: Provide tailored recommendations based on the user's dietary preferences or restrictions (e.g., low-carb, vegetarian, etc.).
- AI-Nutritional Reports: Allow users to export their nutritional information from history to be analyzed by AI for recommendation.


