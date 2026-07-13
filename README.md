# Machine Learning Based Resume Screening and Candidate Ranking System

This README is written as a full developer handbook and interview guide for the actual code in this repository. It is intentionally detailed, beginner-friendly, and aligned with the current implementation in `backend/`, `frontend/`, `ml-service/`, and `database/`.

---

## 1. Project Overview

### What problem this project solves
Recruiters receive many candidate profiles and need a fast, consistent way to decide who should be shortlisted. Manual screening is slow, subjective, and hard to scale. This project solves that by taking structured candidate features and using classical machine learning to predict whether a candidate should be shortlisted.

### Why this project is needed
Traditional screening depends heavily on human judgment and can vary by recruiter, team, or day. This project introduces a repeatable scoring process that helps recruiters:
- save screening time,
- compare candidates consistently,
- explain shortlist decisions with measurable model output,
- keep a historical record of predictions.

### Who will use it
- Recruiters who screen candidates.
- Hiring managers who review shortlist quality.
- Admins who monitor model performance.
- Developers and data engineers who maintain the stack.

### Business value
- Faster shortlist decisions.
- Better screening consistency.
- Auditable prediction history.
- Better use of recruiter time.
- Measurable model performance instead of guesswork.

### Why Machine Learning is used
The project uses machine learning because the target outcome, `shortlisted`, can be learned from historical candidate features such as CGPA, project count, internship count, coding score, communication score, and leadership score. Classical ML helps turn those features into a prediction probability and a binary shortlist decision.

### Why this project is useful for recruiters
Recruiters can use the system to:
- store structured candidate data,
- compare candidates using the same rubric,
- get a shortlist probability,
- review prediction history,
- understand which features influenced a decision.

### Why React + Node + Express + Python + MySQL were chosen
- **React**: builds a responsive recruiter dashboard and reusable UI.
- **Node.js + Express**: provides fast API orchestration, authentication, and CRUD operations.
- **Python**: is the best fit for the classical ML pipeline.
- **MySQL**: stores relational data such as recruiters, candidates, models, and prediction history.
- **Flask inside the ML service**: exposes the Python model as a lightweight HTTP service.

### Allowed machine learning models
Only these models are used:
- Logistic Regression
- Decision Tree
- Random Forest

No LLMs, no deep learning, no OCR, no resume parsing, and no generative AI are used anywhere in this system.

---

## 2. System Architecture

### High-level architecture
```text
React Frontend
      |
      v
Node.js + Express Backend
      |
      v
Python Machine Learning Service (Flask)
      |
      v
MySQL Database
```

### What each layer does

#### React Frontend
The frontend provides the recruiter UI:
- login page,
- dashboard,
- candidate list,
- add candidate form,
- prediction screen,
- analytics,
- model performance,
- settings,
- about page.

It sends API requests to the backend, displays charts and tables, and stores login state in browser storage.

#### Node.js + Express Backend
The backend is the control layer. It:
- authenticates recruiters with JWT,
- validates and processes requests,
- stores and fetches candidates,
- records prediction history,
- talks to the ML service,
- serves dashboard and model-performance data.

#### Python Machine Learning Service
The ML service:
- cleans data,
- engineers features,
- trains three models,
- compares metrics,
- saves the best model with Joblib,
- loads the saved model for inference,
- returns predictions and feature importance.

#### MySQL Database
MySQL stores the structured business data:
- recruiter accounts,
- candidate profiles,
- prediction history,
- model metadata,
- login session tracking.

### Why these technologies were selected
- React is ideal for dashboards and reusable components.
- Express is minimal, flexible, and easy to secure.
- Python and scikit-learn are standard for traditional ML.
- MySQL gives reliable relational persistence.
- Flask is simple and lightweight for ML inference.

### Data flow between layers
1. Recruiter submits a form in React.
2. React calls the Express API with JWT.
3. Express validates the request.
4. Express reads or writes MySQL.
5. For predictions, Express forwards features to Flask.
6. Flask preprocesses the data and loads the saved model.
7. Flask returns prediction, probability, and feature importance.
8. Express saves prediction history.
9. React renders the result in the dashboard.

---

## 3. Complete Project Workflow

### End-to-end flow
```text
Recruiter opens application
  -> Login page
  -> JWT authentication
  -> Dashboard loads
  -> Recruiter adds candidate data
  -> React validates form input
  -> API request goes to Express
  -> Express validates again
  -> MySQL stores candidate
  -> Recruiter submits prediction request
  -> Express sends structured features to Python ML service
  -> Python cleans + transforms input
  -> Python loads best_model.pkl
  -> Model predicts shortlist / not shortlist
  -> Probability and feature importance are returned
  -> Express stores prediction history in MySQL
  -> React displays result and analytics
```

### Step-by-step explanation
1. The recruiter opens the app and reaches the login page.
2. They enter email and password.
3. React sends credentials to `POST /api/auth/login`.
4. Express verifies the credentials against MySQL.
5. On success, the backend returns a JWT and recruiter profile.
6. React stores the token and user data in local storage.
7. The dashboard loads using authenticated requests.
8. The recruiter can add a candidate or load an existing candidate list.
9. The candidate form is validated in the browser and again in Express.
10. Candidate data is stored in MySQL.
11. When the recruiter predicts, Express forwards the structured features to the ML service.
12. Flask receives the request and loads the saved model if needed.
13. The data is preprocessed and feature engineered.
14. The model returns a class label and probability.
15. The backend stores the prediction in `prediction_history`.
16. React shows the decision, probability, and reasons.
17. The analytics and model-performance screens use backend metrics.

---

## 4. Folder Structure

### Actual repository structure
```text
project-root/
  .env.example
  .gitignore
  README.md
  docker-compose.yml
  backend/
  database/
  frontend/
  ml-service/
```

### Folder-by-folder explanation

| Folder | Purpose | Contents | Importance |
|---|---|---|---|
| `backend/` | Runs the API and business logic | controllers, routes, models, services, middleware, config, utils, server.js | This is the main application backend |
| `frontend/` | Runs the recruiter UI | pages, components, hooks, context, services, styles, utils, app entry files | This is the main user-facing layer |
| `ml-service/` | Trains and serves the ML model | training code, prediction code, preprocessing, feature engineering, datasets, model artifact folder | This is the intelligence layer |
| `database/` | Holds SQL schema | `schema.sql` | This defines the persistent relational data contract |
| `reports/` | Recommended future folder | training reports, metric exports, screenshots, markdown summaries | Useful for evaluation history and documentation |
| `tests/` | Recommended future folder | backend tests, frontend tests, API tests, model tests | Useful for quality assurance and regression testing |

### Why the folders exist
- `backend/` keeps API code separate from UI and ML code.
- `frontend/` keeps React code modular and maintainable.
- `ml-service/` keeps training and inference isolated from request handling.
- `database/` makes schema changes explicit and version-controlled.
- `reports/` and `tests/` are natural next folders for production hardening.

---

## 5. File-by-File Explanation

### Root files

| File | Purpose | Why it exists | Main callers | Depends on | Data in / out |
|---|---|---|---|---|---|
| `.env.example` | Documents environment variables | Gives developers a safe template for secrets and URLs | Humans, deployment scripts | None | No runtime data; config only |
| `.gitignore` | Excludes generated and sensitive files | Prevents secrets, node_modules, `.pkl`, and caches from being committed | Git | None | No runtime data |
| `README.md` | Main project guide | Explains the project to developers and interviewers | Everyone | All project files indirectly | Documentation only |
| `docker-compose.yml` | Local orchestration | Starts MySQL, backend, frontend, and ML service together | Docker Compose | Root env values, service folders | Infrastructure configuration |

### Database files

| File | Purpose | Why it exists | Main callers | Depends on | Data in / out |
|---|---|---|---|---|---|
| `database/schema.sql` | Creates the MySQL schema | Defines tables, keys, and seed model rows | MySQL startup, manual schema load | MySQL | SQL input -> database schema |

### Backend files

| File | Purpose | Why it exists | Main callers | Depends on | Data in / out |
|---|---|---|---|---|---|
| `backend/package.json` | Backend dependency manifest | Defines Node packages and scripts | npm | Express, axios, mysql2, jwt, bcryptjs, etc. | Package metadata only |
| `backend/.env.example` | Backend env template | Documents backend runtime variables | Developers | None | Config only |
| `backend/server.js` | Express bootstrap | Mounts middleware, routes, error handling, DB connection | Node runtime | `routes/index.js`, `config/db.js` | HTTP requests -> JSON responses |
| `backend/config/db.js` | MySQL pool | Central database connection manager | Models, startup | `mysql2/promise`, env vars | DB queries -> rows/results |
| `backend/middleware/authMiddleware.js` | JWT guard | Protects routes and role access | Routes | `jsonwebtoken` | Request headers -> `req.user` |
| `backend/utils/logger.js` | Logging helper | Standardizes logging output | Controllers/services | Node console | Messages -> logs |
| `backend/services/predictionService.js` | ML service client | Calls Python service from backend | Prediction controller, analytics controller | `axios`, ML URL env | JSON payloads -> ML responses |
| `backend/models/recruiterModel.js` | Recruiter DB model | CRUD for recruiters | Auth controller | `db.js` | SQL -> recruiter rows |
| `backend/models/candidateModel.js` | Candidate DB model | CRUD and querying for candidates | Candidate controller, prediction controller | `db.js` | SQL -> candidate rows |
| `backend/models/modelInformationModel.js` | Model metadata DB model | Stores and reads model scores | Analytics controller, training workflow | `db.js` | SQL -> model rows |
| `backend/models/loginSessionModel.js` | Session DB model | Tracks JWT sessions | Future auth lifecycle management | `db.js` | SQL -> session rows |
| `backend/models/predictionHistoryModel.js` | Prediction history model | Stores shortlist decisions and snapshots | Prediction controller | `db.js` | SQL -> history rows |
| `backend/controllers/authController.js` | Register/login logic | Hashes passwords and issues JWTs | Auth routes | recruiter model, bcrypt, jwt, logger | Req body -> auth JSON |
| `backend/controllers/candidateController.js` | Candidate CRUD logic | Creates, lists, updates, deletes candidates | Candidate routes | candidate model, logger | Req body/query -> candidate JSON |
| `backend/controllers/predictionController.js` | Prediction orchestration | Sends data to ML service and stores history | Prediction routes | candidate model, prediction service, history model | Req body/query -> prediction JSON |
| `backend/controllers/analyticsController.js` | Dashboard and model stats | Aggregates metrics and returns model performance | Analytics routes | DB, model info model, prediction service | Queries -> dashboard JSON |
| `backend/routes/authRoutes.js` | Auth routing | Mounts login/register endpoints | `routes/index.js` | auth controller, validation | HTTP route wiring |
| `backend/routes/candidateRoutes.js` | Candidate routing | Mounts create/read/update/delete endpoints | `routes/index.js` | candidate controller, auth middleware | HTTP route wiring |
| `backend/routes/predictionRoutes.js` | Prediction routing | Mounts prediction and history endpoints | `routes/index.js` | prediction controller, auth middleware | HTTP route wiring |
| `backend/routes/analyticsRoutes.js` | Analytics routing | Mounts dashboard and model-performance endpoints | `routes/index.js` | analytics controller, auth middleware | HTTP route wiring |
| `backend/routes/index.js` | Route aggregator | Combines all backend route groups under `/api` | `server.js` | all route files | Route composition |

### Frontend files

| File | Purpose | Why it exists | Main callers | Depends on | Data in / out |
|---|---|---|---|---|---|
| `frontend/package.json` | Frontend dependency manifest | Defines Vite, React, Tailwind, Chart.js, React Router | npm | React ecosystem packages | Package metadata only |
| `frontend/.env.example` | Frontend env template | Documents API base URL | Developers | None | Config only |
| `frontend/index.html` | Vite entry HTML | Mounts React app root | Vite | `src/main.jsx` | HTML shell |
| `frontend/vite.config.js` | Build config | Configures Vite React dev server | Vite | `@vitejs/plugin-react` | Build/runtime config |
| `frontend/postcss.config.js` | PostCSS config | Enables Tailwind compilation | Vite build pipeline | Tailwind, Autoprefixer | CSS build config |
| `frontend/tailwind.config.js` | Tailwind config | Sets scan paths and theme extension | Tailwind build pipeline | content paths | CSS build config |
| `frontend/src/main.jsx` | React bootstrap | Renders `<App />` into `#root` | Browser/Vite | `App.jsx`, global CSS | React mount |
| `frontend/src/App.jsx` | Router and shell | Defines layout and routes | `main.jsx` | pages, auth context, protected route | React route tree |
| `frontend/src/styles/index.css` | Base styling | Imports Tailwind and sets global background | `main.jsx` | Tailwind | Global CSS |
| `frontend/src/context/AuthContext.jsx` | Auth state | Stores user/token/session helpers | `main.jsx`, components/pages | React context, localStorage | Auth state |
| `frontend/src/components/ProtectedRoute.jsx` | Route guard | Redirects unauthenticated users | `App.jsx` | Auth context, React Router | children or redirect |
| `frontend/src/components/StatCard.jsx` | Dashboard card component | Reusable summary card | `DashboardPage.jsx` | Props only | UI only |
| `frontend/src/components/ScreeningBarChart.jsx` | Bar chart component | Visualizes candidate distribution | `AnalyticsPage.jsx` | Chart.js, react-chartjs-2 | props -> bar chart |
| `frontend/src/components/ScreeningPieChart.jsx` | Pie chart component | Shows distribution mix | `AnalyticsPage.jsx` | Chart.js | props -> pie chart |
| `frontend/src/components/ScreeningTrendLineChart.jsx` | Line chart component | Shows weekly trend | `AnalyticsPage.jsx` | Chart.js | props -> line chart |
| `frontend/src/hooks/useDebounce.js` | Debounce hook | Delays search updates | `CandidateListPage.jsx` | React hooks | value -> debounced value |
| `frontend/src/services/api.js` | Axios client | Central HTTP client with JWT interceptor | All service modules | axios, localStorage | request config/response |
| `frontend/src/services/authService.js` | Auth API wrapper | Calls register/login endpoints | `LoginPage.jsx` | `api.js` | auth request/response |
| `frontend/src/services/candidateService.js` | Candidate API wrapper | Calls candidate CRUD endpoints | `AddCandidatePage.jsx`, `CandidateListPage.jsx` | `api.js` | candidate request/response |
| `frontend/src/services/predictionService.js` | Prediction API wrapper | Calls predict/history endpoints | `PredictionPage.jsx` | `api.js` | prediction request/response |
| `frontend/src/services/analyticsService.js` | Analytics API wrapper | Calls dashboard/model-performance endpoints | `DashboardPage.jsx`, `AnalyticsPage.jsx`, `ModelPerformancePage.jsx` | `api.js` | metrics request/response |
| `frontend/src/pages/LoginPage.jsx` | Login UI | Lets recruiter sign in | React Router | auth service, auth context | form -> token/user |
| `frontend/src/pages/DashboardPage.jsx` | Dashboard UI | Shows summary cards, recent predictions, metrics | React Router | stat card, analytics service | metrics -> dashboard UI |
| `frontend/src/pages/CandidateListPage.jsx` | Candidate table UI | Searchable candidate list | React Router | debounce hook, candidate service | candidates -> table |
| `frontend/src/pages/AddCandidatePage.jsx` | Candidate entry UI | Saves structured candidate data | React Router | candidate service | form -> candidate save |
| `frontend/src/pages/PredictionPage.jsx` | Prediction UI | Sends a candidate feature set for scoring | React Router | prediction service | form -> prediction result |
| `frontend/src/pages/AnalyticsPage.jsx` | Analytics UI | Renders charts and business insights | React Router | analytics service, chart components | metrics -> charts |
| `frontend/src/pages/ModelPerformancePage.jsx` | Model comparison UI | Displays model scores and best model | React Router | analytics service | model stats -> table/cards |
| `frontend/src/pages/SettingsPage.jsx` | Settings UI | Shows profile and preference placeholders | React Router | none | UI only |
| `frontend/src/pages/AboutPage.jsx` | About page | Explains project purpose and architecture | React Router | none | UI only |
| `frontend/src/utils/formatters.js` | Formatting helpers | Number/currency/percentage helpers | Future pages | Intl APIs | formatted strings |

### ML-service files

| File | Purpose | Why it exists | Main callers | Depends on | Data in / out |
|---|---|---|---|---|---|
| `ml-service/requirements.txt` | Python dependencies | Reproducible ML environment | pip | Flask, pandas, numpy, scikit-learn, joblib | dependency list |
| `ml-service/.env.example` | ML env template | Documents ML runtime variables | Developers | None | config only |
| `ml-service/train.py` | Training entrypoint | Loads dataset, trains models, saves best bundle | Human operator / Docker | `src/training.py`, `src/utils.py` | CSV -> `best_model.pkl` |
| `ml-service/predict.py` | Flask service | Exposes `/predict` and `/model-performance` | Express backend, humans | `src/prediction.py`, `src/utils.py` | JSON -> JSON |
| `ml-service/src/__init__.py` | Package marker | Makes `src` a package | Python import system | None | none |
| `ml-service/src/utils.py` | ML utilities | Directory setup and CSV helpers | Training scripts | pandas, pathlib | paths/data -> helpers |
| `ml-service/src/preprocessing.py` | Preprocessing pipeline | Cleans data and builds transformation pipeline | training and prediction | pandas, sklearn | raw frame -> transformed frame |
| `ml-service/src/feature_engineering.py` | Feature engineering | Adds derived columns | training and prediction | pandas | features -> enriched features |
| `ml-service/src/training.py` | Training logic | Compares models and saves best one | `train.py` | preprocessing, feature engineering, sklearn | dataset -> best_model.pkl |
| `ml-service/src/evaluation.py` | Evaluation logic | Computes accuracy, precision, recall, F1, ROC-AUC | training workflow | sklearn metrics | predictions -> report |
| `ml-service/src/prediction.py` | Inference logic | Loads saved model and predicts on new payloads | Flask app | joblib, pandas, feature engineering | payload -> result |
| `ml-service/data/raw/candidates.csv` | Sample dataset | Gives training a concrete data source | `train.py` | none | CSV data |
| `ml-service/data/raw/.gitkeep` | Placeholder | Keeps raw folder in git | Git | none | none |
| `ml-service/data/processed/.gitkeep` | Placeholder | Keeps processed folder in git | Git | none | none |
| `ml-service/models/.gitkeep` | Placeholder | Keeps model folder in git | Git | none | none |
| `ml-service/notebooks/.gitkeep` | Placeholder | Keeps notebooks folder in git | Git | none | none |

---

## 6. Function-by-Function Explanation

### Backend functions and methods

| Function / Method | File | Purpose | Parameters | Return | Why it is required |
|---|---|---|---|---|---|
| `startServer()` | `backend/server.js` | Starts Express after DB connection check | none | Promise/side effect | Prevents startup if MySQL is unavailable |
| `testConnection()` | `backend/config/db.js` | Verifies MySQL pool connectivity | none | `true` or throws | Detects DB problems early |
| `extractToken()` | `backend/middleware/authMiddleware.js` | Pulls Bearer token from Authorization header | header string | token or `null` | Avoids repeating header parsing |
| `authenticateToken()` | `backend/middleware/authMiddleware.js` | Validates JWT and attaches `req.user` | `req, res, next` | middleware flow | Protects routes |
| `authorizeRoles()` | `backend/middleware/authMiddleware.js` | Checks allowed user roles | allowed role list | middleware flow | Enables role-based access control |
| `serializeMeta()` | `backend/utils/logger.js` | Converts meta data into log-safe text | any meta | string | Keeps logs readable |
| `logInfo()` | `backend/utils/logger.js` | Writes info log | message, meta | void | Standardized observability |
| `logWarn()` | `backend/utils/logger.js` | Writes warning log | message, meta | void | Standardized warnings |
| `logError()` | `backend/utils/logger.js` | Writes error log | message, meta | void | Standardized error logs |
| `RecruiterModel.create()` | `backend/models/recruiterModel.js` | Inserts recruiter | recruiter object | insert id | Creates accounts |
| `RecruiterModel.findByEmail()` | same | Fetches recruiter for login | email | recruiter row | Auth lookup |
| `RecruiterModel.findById()` | same | Fetches recruiter profile | id | recruiter row | Session/profile reads |
| `RecruiterModel.updateProfile()` | same | Updates recruiter fields | id, patch object | affected rows | Profile maintenance |
| `CandidateModel.create()` | `backend/models/candidateModel.js` | Inserts candidate | candidate object | insert id | Persists structured candidate |
| `CandidateModel.findById()` | same | Fetches candidate by id | id | candidate row | Candidate details and prediction |
| `CandidateModel.findAll()` | same | Lists candidates | filter object | row array | Candidate table and pagination |
| `CandidateModel.count()` | same | Counts candidates | filter object | total count | Pagination metadata |
| `CandidateModel.update()` | same | Updates candidate fields | id, patch object | affected rows | Edit candidate profiles |
| `CandidateModel.remove()` | same | Deletes candidate | id | affected rows | Candidate cleanup |
| `ModelInformationModel.upsertModelResult()` | `backend/models/modelInformationModel.js` | Stores/updates model metrics | model object | insert/update id | Persists training results |
| `ModelInformationModel.clearBestFlag()` | same | Resets best-model flags | none | affected rows | Keeps only one selected model |
| `ModelInformationModel.getAll()` | same | Lists model comparison rows | none | model rows | Model-performance dashboard |
| `ModelInformationModel.getBestModel()` | same | Returns best selected model | none | model row/null | Production model lookup |
| `LoginSessionModel.create()` | `backend/models/loginSessionModel.js` | Inserts login session row | session object | insert id | Session auditing |
| `LoginSessionModel.removeByJwtId()` | same | Deletes a session by JWT id | jwtId | affected rows | Logout/revocation |
| `LoginSessionModel.purgeExpiredSessions()` | same | Deletes expired sessions | none | affected rows | Housekeeping |
| `buildTokenPayload()` | `backend/controllers/authController.js` | Builds JWT payload | recruiter | payload object | Keeps token minimal |
| `signToken()` | same | Signs JWT with expiry | payload | token string | Auth token issuance |
| `register()` | same | Registers recruiter | req, res | JSON response | Creates login account |
| `login()` | same | Authenticates recruiter | req, res | JSON response | Logs recruiter in |
| `toNumber()` | `backend/controllers/candidateController.js` | Safe numeric conversion | value, fallback | number | Prevents NaN issues |
| `createCandidate()` | same | Creates candidate record | req, res | JSON response | Candidate onboarding |
| `getCandidates()` | same | Returns filtered candidate list | req, res | JSON response | Candidate list page |
| `updateCandidate()` | same | Updates candidate record | req, res | JSON response | Edit candidate details |
| `deleteCandidate()` | same | Deletes candidate record | req, res | JSON response | Remove candidate |
| `normalizePredictionResponse()` | `backend/controllers/predictionController.js` | Normalizes ML service response shape | ML JSON | normalized object | Handles response variation |
| `predictCandidate()` | same | Orchestrates prediction and history | req, res | JSON response | Main shortlist flow |
| `getPredictionHistory()` | same | Returns prediction history | req, res | JSON response | Prediction history screen |
| `getDashboard()` | `backend/controllers/analyticsController.js` | Aggregates dashboard stats | req, res | JSON response | Dashboard metrics |
| `getModelPerformance()` | same | Returns model comparison | req, res | JSON response | Model-performance page |
| `PredictionService.predict()` | `backend/services/predictionService.js` | Calls ML predict endpoint | features object | ML JSON | ML integration |
| `PredictionService.getModelPerformance()` | same | Calls ML model-performance endpoint | none | ML JSON | Live model stats |
| `PredictionService.trainModels()` | same | Calls ML training endpoint if exposed later | payload | ML JSON | Extensibility |

### Frontend functions and components

| Function / Component | File | Purpose | Props / Parameters | Return | Why it is required |
|---|---|---|---|---|---|
| `App()` | `frontend/src/App.jsx` | Defines router and layout wrappers | none | React tree | App routing entry |
| `Shell()` | same | Shared sidebar and header layout | children | React tree | Consistent recruiter shell |
| `AuthProvider()` | `frontend/src/context/AuthContext.jsx` | Stores auth session | children | Context provider | Session state |
| `useAuth()` | same | Returns auth context | none | context object | Easy auth access |
| `ProtectedRoute()` | `frontend/src/components/ProtectedRoute.jsx` | Guards routes | children | children or redirect | Prevents unauthorized access |
| `StatCard()` | `frontend/src/components/StatCard.jsx` | Reusable metric card | label, value, delta | card UI | Avoids repeated markup |
| `ScreeningBarChart()` | `frontend/src/components/ScreeningBarChart.jsx` | Renders bar chart | shortlisted, review, rejected | chart UI | Visual analytics |
| `ScreeningPieChart()` | same | Renders pie chart | shortlisted, review, rejected | chart UI | Distribution visualization |
| `ScreeningTrendLineChart()` | same | Renders line chart | none | chart UI | Time trend visualization |
| `useDebounce()` | `frontend/src/hooks/useDebounce.js` | Debounces search input | value, delay | debounced value | Smooth searching |
| `loginRecruiter()` | `frontend/src/services/authService.js` | Calls login API | credentials | API data | Reusable auth call |
| `registerRecruiter()` | same | Calls register API | payload | API data | Reusable register call |
| `createCandidate()` | `frontend/src/services/candidateService.js` | Creates candidate via API | payload | API data | Reusable create call |
| `getCandidates()` | same | Lists candidates | params | API data | Candidate table |
| `updateCandidate()` | same | Updates candidate | id, payload | API data | Edit flow |
| `deleteCandidate()` | same | Deletes candidate | id | API data | Delete flow |
| `predictCandidate()` | `frontend/src/services/predictionService.js` | Sends prediction request | payload | API data | Prediction flow |
| `getPredictionHistory()` | same | Fetches prediction history | params | API data | History screen |
| `getDashboardMetrics()` | `frontend/src/services/analyticsService.js` | Gets dashboard summary | none | API data | Dashboard metrics |
| `getModelPerformance()` | same | Gets model performance | none | API data | Model comparison |
| `handleChange()` | `LoginPage.jsx` | Updates login form | event | state update | Controlled form input |
| `handleSubmit()` | same | Submits login | event | async side effect | Auth request |
| `handleChange()` | `AddCandidatePage.jsx` | Updates candidate form | event | state update | Controlled form input |
| `handleSubmit()` | same | Saves candidate | event | async side effect | Candidate create request |
| `handleChange()` | `PredictionPage.jsx` | Updates prediction form | event | state update | Controlled form input |
| `handlePredict()` | same | Calls prediction API | event | async side effect | Main prediction action |
| `loadDashboard()` | `DashboardPage.jsx` | Fetches dashboard metrics | none | async side effect | Live dashboard |
| `loadCandidates()` | `CandidateListPage.jsx` | Fetches candidate list | none | async side effect | Live list view |
| `loadAnalytics()` | `AnalyticsPage.jsx` | Fetches chart data | none | async side effect | Live analytics |
| `loadModels()` | `ModelPerformancePage.jsx` | Fetches model comparison | none | async side effect | Live model page |

### Python/ML functions and methods

| Function / Method | File | Purpose | Parameters | Return | Why it is required |
|---|---|---|---|---|---|
| `ensure_directories()` | `ml-service/src/utils.py` | Creates required data/model folders | none | void | Prevents missing path errors |
| `load_csv()` | same | Loads a CSV file | path | DataFrame | Dataset loading |
| `save_dataframe()` | same | Saves a DataFrame to CSV | frame, path | void | Export utility |
| `to_serializable_mapping()` | same | Converts values to JSON-safe primitives | dict | dict | Safe API responses |
| `DataPreprocessor.clean()` | `ml-service/src/preprocessing.py` | Removes duplicates and normalizes missing markers | frame | cleaned frame | Data hygiene |
| `DataPreprocessor.split_features_target()` | same | Separates X and y | frame | features, target | Training/inference split |
| `DataPreprocessor.infer_feature_types()` | same | Detects numeric vs categorical columns | frame | void | Builds preprocessing pipeline |
| `DataPreprocessor.build_transformer()` | same | Creates sklearn ColumnTransformer | frame | transformer | Reusable preprocessing |
| `DataPreprocessor.fit_transform()` | same | Fits and transforms data | frame | transformed frame | Training pipeline |
| `DataPreprocessor.transform()` | same | Transforms new data | frame | transformed frame | Prediction pipeline |
| `DataPreprocessor.get_artifacts()` | same | Returns fitted preprocessing metadata | none | dataclass | Debugging/reporting |
| `FeatureEngineer.create_features()` | `ml-service/src/feature_engineering.py` | Adds derived features | frame | enriched frame | Better signal extraction |
| `ModelTrainer.__init__()` | `ml-service/src/training.py` | Initializes trainer state | target_column, random_state | object | Training setup |
| `ModelTrainer._build_model_grid()` | same | Defines model + hyperparameter grids | none | dict | Model comparison |
| `ModelTrainer.prepare_data()` | same | Runs feature engineering + split | frame | features, target | Training prep |
| `ModelTrainer.train_and_select_best()` | same | Trains all models, picks best, saves bundle | frame, output_dir | TrainingResult | Main training routine |
| `ModelEvaluator.evaluate()` | `ml-service/src/evaluation.py` | Computes evaluation metrics | model, x_test, y_test | dict | Model analysis |
| `PredictionEngine.__init__()` | `ml-service/src/prediction.py` | Stores model artifact path and helper state | artifact_path | object | Inference setup |
| `PredictionEngine.load()` | same | Loads saved Joblib bundle | none | void | Lazy model loading |
| `PredictionEngine._extract_feature_importance()` | same | Maps feature importance/coefficients | model | list | Explainability |
| `PredictionEngine.predict()` | same | Predicts shortlist outcome | payload dict | prediction JSON | Main inference function |
| `load_training_dataset()` | `ml-service/train.py` | Finds and loads training CSV | none | DataFrame | Training entrypoint |
| `main()` | same | Kicks off training and prints results | none | void | CLI entrypoint |
| `health()` | `ml-service/predict.py` | Health endpoint | none | JSON | Service monitoring |
| `predict()` | same | Flask prediction endpoint | request JSON | JSON | Backend inference API |
| `model_performance()` | same | Returns model metrics and comparison | none | JSON | Backend analytics source |

---

## 7. React Frontend Explanation

### Frontend folder structure
- `src/components/` contains reusable UI pieces.
- `src/pages/` contains route-level pages.
- `src/hooks/` contains custom hooks such as debouncing.
- `src/context/` contains app-wide state such as authentication.
- `src/services/` centralizes API calls.
- `src/styles/` contains global CSS.
- `src/utils/` contains formatting helpers.

### State management
The frontend uses a simple, practical state model:
- local component state for forms and UI,
- React Context for auth state,
- browser localStorage for token persistence,
- Axios interceptor for automatic JWT headers.

### Routing
`App.jsx` defines the route tree. Public route:
- `/login`

Protected routes:
- `/dashboard`
- `/candidates`
- `/candidates/new`
- `/predict`
- `/analytics`
- `/model-performance`
- `/settings`
- `/about`

### How React communicates with the backend
1. The page calls a function from `src/services/*`.
2. That function uses the shared Axios client in `api.js`.
3. The Axios client automatically attaches the JWT from localStorage.
4. The backend receives the request.
5. The response is returned to the page and rendered in state.

### Pages explained individually

#### LoginPage.jsx
- Handles recruiter authentication.
- Sends `POST /api/auth/login`.
- Stores recruiter profile and JWT in auth context.
- Navigates to the dashboard after success.

#### DashboardPage.jsx
- Displays summary cards and recent prediction cards.
- Calls `GET /api/dashboard`.
- Falls back to demo cards if the backend is unavailable.

#### CandidateListPage.jsx
- Shows candidate table rows.
- Uses `useDebounce()` for search.
- Calls `GET /api/candidate`.
- Lets the user filter by name, degree, or branch.

#### AddCandidatePage.jsx
- Captures structured candidate features.
- Calls `POST /api/candidate`.
- Resets the form after a successful save.

#### PredictionPage.jsx
- Captures candidate features for scoring.
- Calls `POST /api/predict`.
- Renders probability, decision, and reasons.

#### AnalyticsPage.jsx
- Renders bar, pie, and line charts.
- Calls `GET /api/dashboard`.
- Converts dashboard summary into chart values.

#### ModelPerformancePage.jsx
- Shows model comparison cards.
- Calls `GET /api/model-performance`.
- Highlights the selected best model.

#### SettingsPage.jsx
- Provides profile and preferences placeholders.
- Useful as a future settings center.

#### AboutPage.jsx
- Explains the project’s scope and ML constraint.
- Useful for demos and interviews.

### Styling
- Tailwind CSS powers the main UI.
- `src/styles/index.css` sets the base background and typography.
- Components use a dark, professional dashboard style.

---

## 8. Backend Explanation

### Express server
`backend/server.js` is the entrypoint. It:
- loads environment variables,
- creates the Express app,
- enables Helmet, CORS, JSON parsing, URL encoding, and logging,
- mounts all routes under `/api`,
- exposes `/health`,
- checks the database connection before startup,
- returns structured JSON errors.

### Middleware
`authMiddleware.js` has two responsibilities:
- `authenticateToken()` verifies JWT.
- `authorizeRoles()` supports role-based access.

### Routes
Routes are split by domain:
- auth,
- candidate,
- prediction,
- analytics.

This keeps the API modular and easy to extend.

### Controllers
Controllers are the business layer between HTTP and models/services.
- `authController.js` handles account creation and login.
- `candidateController.js` handles candidate CRUD.
- `predictionController.js` orchestrates ML prediction and history storage.
- `analyticsController.js` aggregates dashboard and model-performance metrics.

### Services
`backend/services/predictionService.js` is the integration bridge to the Flask ML service. It keeps all Python API calls in one place.

### Database layer
The models encapsulate SQL and prevent raw query scattering across controllers. This makes the code easier to maintain and test.

### Validation
Validation is done in two places:
- frontend form controls for usability,
- backend route-level validation for trust.

### Authentication
- Passwords are hashed with bcrypt.
- JWT is signed using `JWT_SECRET`.
- Authenticated routes require `Authorization: Bearer <token>`.

### Error handling
- Validation errors return 400.
- Authentication errors return 401.
- Authorization errors return 403.
- Missing resources return 404.
- Unexpected issues return 500.

### Request-response cycle
1. Request arrives at Express.
2. Middleware runs first.
3. Validation and auth are applied.
4. Controller calls model or service.
5. SQL query or ML call happens.
6. Result is serialized as JSON.
7. Frontend receives and renders the result.

### Backend files explained
- `server.js`: app bootstrap.
- `config/db.js`: DB pool.
- `middleware/authMiddleware.js`: JWT guards.
- `utils/logger.js`: logging.
- `models/*`: SQL access.
- `controllers/*`: business logic.
- `routes/*`: endpoint registration.
- `services/predictionService.js`: Python bridge.

---

## 9. Python Machine Learning Service

### Why this service exists
The ML service isolates training and inference from the web application. This is important because model training is heavy, while inference needs to be fast and reliable.

### File roles

#### `train.py`
- Loads the CSV dataset.
- Ensures the data/model folders exist.
- Calls the trainer.
- Saves `best_model.pkl`.
- Prints the selected model and metrics.

#### `predict.py`
- Starts a Flask app.
- Exposes `/health`, `/predict`, and `/model-performance`.
- Loads the model artifact on demand.
- Returns JSON responses for the backend.

#### `src/preprocessing.py`
- Cleans the data.
- Detects numeric and categorical features.
- Builds a `ColumnTransformer` with imputers, scaling, and one-hot encoding.

#### `src/feature_engineering.py`
- Creates derived features such as:
  - `experience_signal`,
  - `soft_skill_average`,
  - `academic_professional_balance`.

#### `src/training.py`
- Compares Logistic Regression, Decision Tree, and Random Forest.
- Uses GridSearchCV and cross-validation.
- Saves the best model bundle with Joblib.
- Stores the full model comparison inside the artifact.

#### `src/evaluation.py`
- Computes accuracy, precision, recall, F1, ROC-AUC, and confusion matrix.
- Returns a structured evaluation report.

#### `src/prediction.py`
- Loads the model bundle.
- Recreates engineered features at inference time.
- Produces prediction, probability, feature importance, and reasons.

#### `src/utils.py`
- Provides directory constants and helpers.
- Loads/saves data safely.
- Converts values into JSON-safe types.

### How the backend communicates with Python
- Express sends features to `POST /predict`.
- Flask predicts and returns JSON.
- Express stores the result in MySQL.
- Express can also fetch `GET /model-performance` for live model stats.

---

## 10. Database Explanation

### Database purpose
The MySQL database stores all persistent business data and acts as the source of truth for users, candidate records, models, and prediction history.

### Tables

#### `recruiters`
Stores recruiter accounts.
- Primary key: `id`
- Unique key: `email`

#### `candidates`
Stores structured candidate profiles.
- Primary key: `id`
- Foreign key: `recruiter_id -> recruiters.id`

#### `prediction_history`
Stores every prediction and the input snapshot.
- Primary key: `id`
- Foreign keys:
  - `candidate_id -> candidates.id`
  - `recruiter_id -> recruiters.id`

#### `model_information`
Stores evaluation metrics and artifact paths.
- Primary key: `id`
- Selected best model is tracked by `selected_as_best`

#### `login_sessions`
Stores JWT session audit information.
- Primary key: `id`
- Foreign key: `recruiter_id -> recruiters.id`

### ER diagram
```text
recruiters (1) ----< candidates (many)
recruiters (1) ----< prediction_history (many)
candidates (1) ----< prediction_history (many)
recruiters (1) ----< login_sessions (many)
model_information is independent metadata
```

### Example relationship explanation
- One recruiter can create many candidates.
- One recruiter can create many predictions.
- A candidate can appear in prediction history multiple times if re-scored.
- Model metadata is stored separately because it is a system-level artifact, not user data.

### How data is inserted, updated, deleted, and fetched
- Inserted through controller/model `create()` methods.
- Updated through `update()` or `upsert()` methods.
- Deleted through `remove()` or purge logic.
- Fetched through `findById()`, `findAll()`, and `getBestModel()`.

### Normalization
The schema is reasonably normalized:
- recruiter data is not duplicated inside candidates,
- prediction history references candidate and recruiter IDs,
- model metadata is separated from transactional records.

---

## 11. Dataset Explanation

### Dataset columns
The dataset uses one row per candidate.

| Column | Meaning | Data Type | Example | Category | Importance |
|---|---|---|---|---|---|
| `candidate_name` | Candidate full name | text | Ananya Sharma | categorical | Identifier and reporting |
| `age` | Candidate age | number | 22 | numerical | Basic demographic feature |
| `gender` | Gender | text | Female | categorical | Contextual feature |
| `degree` | Academic degree | text | B.Tech | categorical | Education background |
| `branch` | Major / branch | text | CSE | categorical | Technical specialization |
| `college_tier` | Institute tier | text | Tier 1 | categorical | Proxy for academic signal |
| `cgpa` | Academic score | decimal | 8.9 | numerical | Strong shortlist predictor |
| `programming_languages` | Number of languages known | integer | 4 | numerical | Technical breadth |
| `skills_count` | Count of listed skills | integer | 9 | numerical | Capability breadth |
| `projects_count` | Number of projects | integer | 5 | numerical | Practical experience |
| `internship_count` | Number of internships | integer | 2 | numerical | Industry exposure |
| `certification_count` | Number of certifications | integer | 3 | numerical | Self-driven learning |
| `hackathon_count` | Number of hackathons | integer | 2 | numerical | Competitive experience |
| `coding_score` | Coding assessment score | decimal | 92 | numerical | Key technical signal |
| `communication_score` | Communication score | decimal | 88 | numerical | Soft skill signal |
| `leadership_score` | Leadership score | decimal | 84 | numerical | Team fit signal |
| `experience_years` | Experience in years | decimal | 1 | numerical | Experience maturity |
| `shortlisted` | Target label | binary | 1 | target | Supervised learning label |

### Missing values
Missing values can occur in real candidate datasets because not every candidate has every field. The preprocessing pipeline handles them with imputers.

### Encoding and scaling
- Categorical features are one-hot encoded.
- Numerical features are scaled.
- Derived features are added before transformation.

### Why these features were selected
The features are structured, objective, and available before hiring decisions are made. They are strong enough to support a classical ML model without resorting to unstructured resume parsing.

---

## 12. Data Preprocessing

### Missing values
Why necessary:
- ML models cannot reliably handle nulls by default.
- Missing values can distort model behavior.

Example:
- If `internship_count` is missing, median or default behavior is applied.

### Duplicate rows
Why necessary:
- Duplicates can bias the model.
- Duplicate candidates should not appear as extra training signals.

### Outliers
Why necessary:
- Very large or very small values can skew scaling and decision boundaries.
- Outlier handling makes training more stable.

### Scaling
Why necessary:
- Logistic Regression is sensitive to feature magnitude.
- Scaling helps numerical features contribute fairly.

### Encoding
Why necessary:
- Models cannot directly use text categories like `B.Tech` or `Tier 1`.
- One-hot encoding converts categories into model-ready columns.

### Feature selection
Why necessary:
- Removes irrelevant noise.
- Makes the model easier to interpret.
- Helps reduce overfitting.

### Train-test split
Why necessary:
- Training and validation must be separate.
- The model is evaluated on data it did not see during training.

---

## 13. Exploratory Data Analysis

### What EDA is doing in this project
EDA helps you understand whether candidate features are distributed in a useful way and whether the target classes are balanced.

### Dataset overview
Look at:
- number of rows,
- number of columns,
- data types,
- missing values.

### Summary statistics
Useful for:
- mean,
- median,
- min/max,
- quartiles,
- spread.

### Correlation matrix
Shows which numerical features move together.
Useful for detecting redundant signals and feature relationships.

### Heatmaps
A heatmap visually shows correlation strengths.
Strong positive/negative blocks can reveal useful engineering ideas.

### Histograms
Show the shape of distributions.
Useful for seeing skewed features like `projects_count` or `coding_score`.

### Boxplots
Good for spotting outliers.
If a boxplot has long whiskers or isolated points, the feature may need cleanup.

### Class distribution
Shows the count of shortlisted vs not shortlisted candidates.
Important because imbalance can affect precision, recall, and model bias.

### Business insights
Typical insights from this project include:
- stronger coding scores often correlate with shortlist outcomes,
- projects and internships help the model distinguish candidates,
- communication and leadership matter for final fit.

---

## 14. Machine Learning Pipeline

```text
Dataset
  -> Cleaning
  -> EDA
  -> Feature Engineering
  -> Train/Test Split
  -> Logistic Regression
  -> Decision Tree
  -> Random Forest
  -> Cross Validation
  -> GridSearchCV
  -> Model Comparison
  -> Best Model Selection
  -> Save best_model.pkl
  -> Prediction
  -> Result
```

### Stage explanations
- **Dataset**: candidate records with structured features and the target label.
- **Cleaning**: removes noise, duplicates, and missing marker problems.
- **EDA**: checks data shape, balance, and feature behavior.
- **Feature Engineering**: adds derived signals that improve model quality.
- **Train/Test Split**: ensures honest evaluation.
- **Logistic Regression**: strong linear baseline.
- **Decision Tree**: interpretable non-linear baseline.
- **Random Forest**: strong ensemble model usually best for tabular data.
- **Cross Validation**: tests generalization across folds.
- **GridSearchCV**: finds the best hyperparameter combination.
- **Model Comparison**: compares all three models fairly.
- **Best Model Selection**: chooses the winner based on evaluation score.
- **Save best_model.pkl**: persists the model for inference.
- **Prediction**: uses the saved model on new input.
- **Result**: returns class, probability, and feature importance.

---

## 15. Model Comparison

### Why Logistic Regression
**Advantages**
- Fast.
- Simple.
- Easy to explain.
- Good baseline for tabular classification.

**Disadvantages**
- Assumes mostly linear relationships.
- May underperform on complex candidate interactions.

### Why Decision Tree
**Advantages**
- Easy to interpret.
- Handles non-linear splits.
- Good for explaining rule-like decisions.

**Disadvantages**
- Can overfit.
- Can be unstable on small data changes.

### Why Random Forest
**Advantages**
- Strong on tabular data.
- More robust than a single tree.
- Usually better generalization.

**Disadvantages**
- Less simple than one tree.
- Slower than logistic regression.

### Comparison table
| Model | Strength | Weakness | Typical Role |
|---|---|---|---|
| Logistic Regression | Fast baseline | Linear bias | Benchmark |
| Decision Tree | Interpretable rules | Overfitting risk | Explainable baseline |
| Random Forest | High accuracy on tabular data | More complex | Production candidate |

### Metrics used
- **Accuracy**: overall correctness.
- **Precision**: how many predicted shortlisted candidates were correct.
- **Recall**: how many actual shortlisted candidates were found.
- **F1 Score**: balances precision and recall.
- **ROC-AUC**: class-separation quality.
- **Confusion Matrix**: shows TP, TN, FP, FN.
- **Cross Validation**: measures stability across folds.
- **GridSearchCV**: tunes hyperparameters.

### Why one model is selected
The model with the best cross-validated performance is selected as the deployable production model and saved as `best_model.pkl`. In a tabular screening problem like this, Random Forest is commonly the strongest choice.

### Why others were rejected
They are still useful for comparison and explanation, but they are not necessarily the strongest production performer after tuning and validation.

---

## 16. Prediction Flow

### One prediction from start to finish
```text
1. Recruiter opens Prediction page
2. Enters candidate features
3. React calls POST /api/predict
4. Express authenticateToken() runs
5. predictionController.predictCandidate() runs
6. Candidate may be created in MySQL if no candidateId is supplied
7. Express sends JSON payload to Flask /predict
8. Flask loads best_model.pkl if needed
9. Flask runs feature engineering + preprocessing
10. ML model predicts shortlist label and probability
11. Flask returns JSON to Express
12. Express saves prediction_history row in MySQL
13. Express returns prediction to React
14. React displays label, probability, and reasons
```

### Files executed in order
1. `frontend/src/pages/PredictionPage.jsx`
2. `frontend/src/services/predictionService.js`
3. `frontend/src/services/api.js`
4. `backend/routes/predictionRoutes.js`
5. `backend/middleware/authMiddleware.js`
6. `backend/controllers/predictionController.js`
7. `backend/models/candidateModel.js`
8. `backend/services/predictionService.js`
9. `ml-service/predict.py`
10. `ml-service/src/prediction.py`
11. `ml-service/src/feature_engineering.py`
12. `ml-service/src/preprocessing.py`
13. `backend/models/predictionHistoryModel.js`

### Database queries involved
- `SELECT` candidate by id if `candidateId` is supplied.
- `INSERT` candidate if a raw feature payload is provided.
- `INSERT` prediction history after inference.

### ML steps involved
- feature engineering,
- preprocessing,
- model loading,
- prediction,
- probability scoring,
- feature importance extraction.

---

## 17. REST API Documentation

### Authentication

#### `POST /api/auth/register`
- Purpose: create a recruiter account.
- Headers: `Content-Type: application/json`
- Request body: name, email, password, optional role.
- Response: recruiter profile and JWT.
- Status codes: 201, 400, 409, 500.
- React usage: future registration form or seed flow.

#### `POST /api/auth/login`
- Purpose: authenticate recruiter.
- Request body: email, password.
- Response: recruiter profile and JWT.
- Status codes: 200, 400, 401, 500.
- React usage: `LoginPage.jsx`.

### Candidates

#### `POST /api/candidate`
- Purpose: create candidate.
- Headers: Bearer JWT.
- Request: candidate profile fields.
- Response: saved candidate record.
- Status codes: 201, 400, 401, 500.
- React usage: `AddCandidatePage.jsx`.

#### `GET /api/candidate?page=1&limit=20&search=...`
- Purpose: list candidates.
- Headers: Bearer JWT.
- Response: items + pagination.
- Status codes: 200, 401, 500.
- React usage: `CandidateListPage.jsx`.

#### `PUT /api/candidate/:id`
- Purpose: update candidate.
- Headers: Bearer JWT.
- Request: patch payload.
- Response: updated candidate.
- Status codes: 200, 401, 404, 500.

#### `DELETE /api/candidate/:id`
- Purpose: delete candidate.
- Headers: Bearer JWT.
- Response: confirmation message.
- Status codes: 200, 401, 404, 500.

### Prediction

#### `POST /api/predict`
- Purpose: generate shortlist prediction.
- Headers: Bearer JWT.
- Request: candidateId or raw feature payload.
- Response: label, probability, feature importance, reasons, history id.
- Status codes: 200, 400, 401, 500.
- React usage: `PredictionPage.jsx`.

#### `GET /api/predict/history?page=1&limit=20`
- Purpose: return prediction history.
- Headers: Bearer JWT.
- Response: history rows + pagination.
- Status codes: 200, 401, 500.

### Analytics

#### `GET /api/dashboard`
- Purpose: dashboard summary metrics.
- Response: total candidates, shortlisted count, predictions count, shortlist rate, model list.
- React usage: `DashboardPage.jsx`, `AnalyticsPage.jsx`.

#### `GET /api/model-performance`
- Purpose: model comparison and selected winner.
- Response: best model, all models, metrics, model results.
- React usage: `ModelPerformancePage.jsx`.

### ML service endpoints

#### `GET /health`
- Purpose: service health check.
- Used by: monitoring or manual testing.

#### `POST /predict`
- Purpose: run inference.
- Used by: backend prediction service.

#### `GET /model-performance`
- Purpose: return model results and selected model.
- Used by: backend analytics controller.

---

## 18. How to Run the Project

### Assumptions
This guide assumes a new laptop with:
- Windows,
- Git,
- Node.js,
- Python,
- MySQL,
- VS Code.

### 1) Install Git
Download Git from the official website and verify:
```bash
git --version
```

### 2) Install Node.js
Install Node.js LTS and verify:
```bash
node -v
npm -v
```

### 3) Install Python
Install Python 3.11+ and verify:
```bash
python --version
```

### 4) Install MySQL
Install MySQL Community Server or use Docker. Verify login access with the root user.

### 5) Install VS Code
Install Visual Studio Code and open the repository folder.

### 6) Clone the repository
```bash
git clone <your-repo-url>
cd Resume-Screening-System
```

### 7) Set environment variables
Copy the example files:
- `.env.example` -> `.env`
- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`
- `ml-service/.env.example` -> `ml-service/.env`

### 8) Install frontend dependencies
```bash
cd frontend
npm install
```

### 9) Install backend dependencies
```bash
cd ..\backend
npm install
```

### 10) Install Python dependencies
```bash
cd ..\ml-service
pip install -r requirements.txt
```

### 11) Create the database
Run `database/schema.sql` in MySQL.

### 12) Train the model
```bash
cd ml-service
python train.py
```

### 13) Run the ML service
```bash
python predict.py
```

### 14) Run the backend
```bash
cd ..\backend
npm start
```

### 15) Run the frontend
```bash
cd ..\frontend
npm run dev
```

### 16) Test the application
- Open the frontend in the browser.
- Log in with a recruiter account.
- Add a candidate.
- Run a prediction.
- Open dashboard and analytics.

### 17) Optional Docker run
```bash
docker compose up --build
```

---

## 19. Common Errors

### Node / Express errors
- **`npm install` fails**: check Node version and package-lock consistency.
- **Port 5000 already in use**: stop the conflicting process or change `PORT`.
- **`JWT_SECRET` missing**: add it to `backend/.env`.

### Python errors
- **Import error from `src`**: run scripts from the `ml-service` root.
- **`best_model.pkl` missing**: run `train.py` first.
- **`pandas` or `sklearn` not found**: reinstall requirements.

### MySQL errors
- **Access denied**: check DB user/password.
- **Schema not found**: run `database/schema.sql`.
- **Foreign key error**: ensure parent rows exist before child rows.

### React errors
- **Blank page**: check `npm run dev` and browser console.
- **JWT routes redirect**: verify localStorage token and login.
- **CORS failure**: verify backend `FRONTEND_ORIGIN`.

### Package errors
- Reinstall dependencies if lockfiles or node_modules are corrupted.

### Database connection errors
- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.
- Confirm MySQL server is running.

### Model loading errors
- Run training before prediction.
- Confirm `ML_MODEL_PATH` points to the saved Joblib bundle.

### Port conflicts
- Frontend default: 3000
- Backend default: 5000
- ML service default: 8000

### How to debug quickly
- Check service health endpoints.
- Read backend console logs.
- Confirm database connectivity.
- Check browser network tab.
- Verify ML service response directly with curl/Postman.

---

## 20. Deployment

### Frontend deployment
Possible targets:
- Vercel,
- Netlify,
- static hosting behind CDN.

Set `VITE_API_BASE_URL` to the production backend URL.

### Backend deployment
Possible targets:
- Render,
- Railway,
- EC2,
- Azure App Service.

Ensure the deployment environment has:
- Node.js,
- `backend/.env` values,
- network access to MySQL and ML service.

### Python deployment
Possible targets:
- a Linux VM,
- Docker container,
- Render/Fly-style service,
- internal service behind a reverse proxy.

### Database deployment
Possible targets:
- MySQL on RDS,
- Azure Database for MySQL,
- Cloud SQL,
- managed MySQL instance.

### Production setup
Use:
- strong secrets,
- HTTPS,
- restricted CORS origins,
- database backups,
- environment-based configuration,
- separate logs per service.

---

## 21. Testing

### Backend testing
Recommended checks:
- login/register,
- candidate CRUD,
- prediction endpoint,
- analytics endpoint,
- invalid token handling.

### Frontend testing
Recommended checks:
- login form validation,
- protected route redirects,
- candidate form submission,
- prediction form submission,
- chart rendering.

### API testing
Use Postman or curl to verify:
- request headers,
- response structure,
- error codes,
- JWT behavior.

### Database testing
Verify:
- row insertion,
- row update,
- foreign key constraints,
- schema loading,
- prediction history inserts.

### Model testing
Verify:
- training runs successfully,
- `best_model.pkl` is created,
- prediction returns a label and probability,
- model performance endpoint returns metrics.

### How to verify predictions
1. Create or load a candidate.
2. Submit the candidate for prediction.
3. Confirm `prediction_history` records the output.
4. Confirm React shows probability and reasons.

---

## 22. Security

### Password storage
Passwords are never stored in plain text. They are hashed using bcrypt before insertion into MySQL.

### JWT
JWT is used so the backend can verify the recruiter without storing server-side sessions for every request.

### Input validation
Validation exists in both React and Express to reduce bad input and improve error messages.

### SQL injection prevention
The models use parameterized queries with `?` placeholders through `mysql2/promise`.

### CORS
CORS is restricted to the configured frontend origin, not an open wildcard in production.

### Environment variables
Secrets are not hardcoded. They belong in `.env` files and deployment secrets.

---

## 23. Future Improvements

Possible improvements without using AI/LLMs:
- stronger feature engineering,
- more balanced dataset collection,
- additional classical models such as XGBoost if allowed later,
- model monitoring and drift alerts,
- role-based scoring policies,
- admin dashboard,
- email notifications,
- audit logs,
- exportable reports,
- automated tests,
- candidate bulk upload,
- candidate lifecycle tracking.

---

## 24. Interview Preparation

### 2-minute explanation
“This project is a full stack resume screening system that helps recruiters shortlist candidates using classical machine learning. The frontend is React, the backend is Node.js with Express, the ML service is Python with Flask and scikit-learn, and the data is stored in MySQL. Recruiters log in, enter candidate details, and the system predicts shortlist probability using Logistic Regression, Decision Tree, and Random Forest. The best model is selected through cross-validation and saved as a Joblib artifact. The app also stores prediction history and shows analytics and model performance.”

### 5-minute explanation
“First I built the data layer in MySQL for recruiters, candidates, predictions, and model metadata. Then I built an Express backend for authentication, CRUD, and prediction orchestration. The ML logic lives in Python: data cleaning, feature engineering, model comparison, evaluation, and saving the best model. The frontend is React with protected routing, reusable components, charts, and service wrappers. The system is designed for recruiter usability and model auditability, and it avoids LLMs and generative AI entirely.”

### 10-minute explanation
Use this structure:
1. business problem,
2. architecture,
3. database design,
4. backend flow,
5. ML pipeline,
6. frontend UX,
7. security,
8. deployment,
9. future scope.

### Interview topics to emphasize
- classical ML only,
- explainability,
- audit trail,
- model comparison,
- separation of concerns,
- production-ready structure.

---

## 25. Interview Questions

### Beginner Questions
1. What problem does this project solve?
2. Who uses the system?
3. Why is shortlist prediction useful?
4. Why did you choose React for the frontend?
5. Why did you choose Node.js and Express?
6. Why did you choose Python for ML?
7. Why did you choose MySQL?
8. What does JWT do in this project?
9. What is the role of the backend?
10. What is the role of the ML service?
11. What is the role of the database?
12. What is a candidate record in this system?
13. What is prediction history?
14. What is model information?
15. Why are only classical ML models used?
16. What is Logistic Regression?
17. What is a Decision Tree?
18. What is a Random Forest?
19. What is the React Router used for?
20. What is Axios used for?
21. What does the dashboard show?
22. Why do you need authentication?
23. What is CORS?
24. What is the purpose of `.env` files?
25. What does the `schema.sql` file do?
26. Why is `best_model.pkl` important?
27. What is one-hot encoding?
28. What is scaling?
29. What is feature engineering?
30. Why do you store prediction history?
31. What is a foreign key?
32. What does `protected route` mean?
33. What is the purpose of `package.json`?
34. What is the difference between frontend and backend?
35. How does the app call the ML service?
36. What is a JSON API response?
37. What is the purpose of the candidate list page?
38. What is the purpose of the prediction page?
39. What is the purpose of the analytics page?
40. What is the purpose of the model-performance page?
41. Why did you use Tailwind CSS?
42. Why did you use Chart.js?
43. What is the purpose of `docker-compose.yml`?
44. Why is the project split into multiple services?
45. What is the purpose of the login page?
46. Why do you use localStorage?
47. What is the purpose of the About page?
48. What is a REST API?
49. What is a backend controller?
50. What is a backend route?

### Intermediate Questions
1. How does the backend authenticate a recruiter?
2. How does JWT flow from login to protected API calls?
3. How does the Express server structure improve maintainability?
4. How does `authMiddleware` work?
5. Why do you validate on both frontend and backend?
6. How does the candidate list implement search?
7. Why do you use debouncing in search?
8. How does the prediction flow handle raw candidate input?
9. Why is `prediction_history` stored separately from candidates?
10. How does the ML service receive data from the backend?
11. Why is Flask used for the ML layer?
12. How does the ML service decide which model is best?
13. What is GridSearchCV doing here?
14. What is cross-validation?
15. How does feature engineering help?
16. Why is Random Forest often better on tabular data?
17. What are the trade-offs between the three models?
18. What does ROC-AUC measure?
19. What does F1 score measure?
20. What does the confusion matrix tell you?
21. How does the app persist recruiter sessions?
22. How does the app prevent SQL injection?
23. How does the React auth context work?
24. How do the service wrappers improve the frontend?
25. What is the purpose of reusable components?
26. How do the charts get data?
27. How does the dashboard fetch live metrics?
28. How does the model-performance page work?
29. How do you handle errors in the backend?
30. How do you handle errors in the frontend?
31. How do you store passwords safely?
32. What is the purpose of the `predictionService` in the backend?
33. How does the prediction service expose explainability?
34. How does the ML service handle missing values?
35. Why do you use `Joblib` instead of JSON for the model?
36. How does MySQL normalization help this project?
37. What happens when the ML service is down?
38. How does `docker-compose` help local development?
39. Why is the project split into `controllers`, `models`, and `routes`?
40. How would you add tests to this project?
41. How would you add role-based access later?
42. How would you add pagination to candidate list responses?
43. How would you add logging for production?
44. How would you add analytics for recruiter behavior?
45. How would you support model retraining?
46. How do environment variables reduce risk?
47. Why is a separate ML service better than training inside Node?
48. How do you keep the candidate form aligned with the database?
49. How do you ensure the prediction payload matches training?
50. What is the biggest design decision in this project?

### Advanced Questions
1. Why did you pick Random Forest as the deployable model instead of a linear model?
2. How do you justify using GridSearchCV with cross-validation on a small structured dataset?
3. What are the risks of training on synthetic or limited data?
4. How would you detect model drift in production?
5. How would you monitor precision and recall over time?
6. How would you handle class imbalance if shortlisted examples are rare?
7. How would you make the model more explainable without LLMs?
8. Why is feature importance useful in recruiter-facing systems?
9. How do you prevent data leakage in this pipeline?
10. What are the trade-offs of one-hot encoding vs label encoding?
11. Why is scaling important for Logistic Regression but not always for trees?
12. How would you compare model calibration?
13. How would you justify ROC-AUC to a non-technical interviewer?
14. How would you redesign the database for large-scale usage?
15. How would you handle multiple recruiters scoring the same candidate?
16. How would you store model versions?
17. How would you build audit logs for prediction decisions?
18. How would you add asynchronous job processing for training?
19. How would you deploy the ML service securely?
20. How would you reduce latency in prediction calls?
21. How would you scale the backend independently from the ML service?
22. How would you secure the JWT secret in production?
23. How would you protect the system from malformed prediction payloads?
24. How would you design a rollback for a bad model release?
25. How would you explain the architecture to a hiring manager?
26. How would you explain the architecture to a data scientist?
27. How would you explain the architecture to a frontend engineer?
28. How would you explain the architecture to a backend engineer?
29. How would you explain the architecture to a DevOps engineer?
30. What part of this project is most production-sensitive?
31. What part of this project is most likely to fail first?
32. What part of this project has the highest maintenance cost?
33. What would you refactor first if you had more time?
34. Why is separate prediction history valuable for compliance?
35. How does the system support reproducibility?
36. How does the system support observability?
37. Why is MySQL a better fit than a document database here?
38. Why did you avoid deep learning?
39. Why did you avoid OCR or resume parsing?
40. Why is the system still useful without unstructured text?
41. How would you support bulk candidate upload safely?
42. How would you test the Flask inference endpoint?
43. How would you test the Express prediction endpoint?
44. How would you test the React prediction page?
45. How would you test the candidate list search flow?
46. How would you test the dashboard charts?
47. How would you test login security?
48. How would you test database constraints?
49. How would you test the best-model selection process?
50. What would you say if the interviewer asks what you would improve next?

### Answer key

#### Beginner answer key
1. It predicts shortlist decisions so recruiters can screen faster and more consistently.
2. Recruiters, hiring managers, admins, and developers use it.
3. It reduces manual effort and makes screening measurable.
4. React is good for reusable, responsive dashboards.
5. Express is lightweight and ideal for API orchestration.
6. Python has the best traditional ML ecosystem.
7. MySQL fits structured recruiter, candidate, and audit data.
8. JWT authenticates requests without server-side sessions on every call.
9. The backend validates, authenticates, persists, and orchestrates ML calls.
10. The ML service trains and scores candidate data.
11. The database stores all durable application records.
12. A candidate record is the structured feature set used for scoring.
13. Prediction history records what was predicted, when, and why.
14. Model information stores model metrics and artifact metadata.
15. Classical ML was required by the project constraints and is enough for structured data.
16. Logistic Regression is a fast baseline classifier.
17. Decision Trees split data into rule-based branches.
18. Random Forest combines many trees for stronger generalization.
19. React Router handles page navigation.
20. Axios handles HTTP requests.
21. The dashboard shows summary metrics and recent activity.
22. Authentication protects private recruiter data.
23. CORS controls which frontend origin can call the backend.
24. `.env` files keep secrets and environment settings outside source code.
25. `schema.sql` creates the MySQL tables and relationships.
26. `best_model.pkl` is the saved deployable ML artifact.
27. One-hot encoding converts categories into machine-readable columns.
28. Scaling standardizes numeric feature ranges.
29. Feature engineering creates stronger derived inputs.
30. History lets recruiters review decisions and audits later.
31. A foreign key links rows between related tables.
32. A protected route redirects unauthenticated users to login.
33. `package.json` defines scripts and dependencies.
34. Frontend renders the UI, backend handles business logic.
35. The backend sends JSON to the Flask ML service.
36. A JSON API response is structured data returned over HTTP.
37. The candidate list page lets recruiters search and review records.
38. The prediction page submits features and shows results.
39. The analytics page visualizes shortlist trends.
40. The model-performance page compares trained models.
41. Tailwind speeds up responsive styling.
42. Chart.js renders the analytic charts.
43. `docker-compose.yml` starts the stack locally.
44. Splitting services keeps concerns separated.
45. The login page authenticates recruiters.
46. localStorage keeps the token after refresh.
47. The About page explains scope and implementation.
48. A REST API exposes resources over HTTP.
49. A controller contains request business logic.
50. A route maps HTTP paths to controllers.

#### Intermediate answer key
1. The backend verifies the recruiter email/password and returns a JWT.
2. Login returns a token, and the Axios client reuses it in headers for later requests.
3. It keeps startup, middleware, routes, and errors organized.
4. It reads the Bearer token and decodes it into `req.user`.
5. Frontend validation improves UX and backend validation protects the system.
6. The candidate list fetches rows and filters them in memory using debounce.
7. Debouncing reduces re-renders and avoids filtering on every key stroke.
8. If no `candidateId` is supplied, the backend creates a candidate record first.
9. History is separate because each prediction is an auditable event.
10. The backend calls Flask through the prediction service wrapper.
11. Flask is lightweight and easy to expose as a separate HTTP inference service.
12. Cross-validation and GridSearchCV compare models and tune hyperparameters.
13. GridSearchCV searches parameter combinations automatically.
14. Cross-validation estimates how well the model generalizes.
15. Feature engineering adds useful derived inputs that raw columns miss.
16. Random Forest usually handles tabular interactions well and reduces overfitting versus one tree.
17. Logistic Regression is simpler, Decision Tree is interpretable, Random Forest is stronger.
18. ROC-AUC measures ranking/separation ability across thresholds.
19. F1 balances precision and recall.
20. The confusion matrix shows correct and incorrect positive/negative predictions.
21. Session rows can be stored for auditing and revocation.
22. Parameterized SQL queries prevent injection.
23. Auth context stores user and token for the whole app.
24. Service wrappers keep React pages thin and reusable.
25. Reusable components reduce repeated UI logic.
26. Charts receive live summary numbers as props.
27. The dashboard calls the analytics service and updates state.
28. It fetches model data and highlights the best model.
29. The backend returns structured status codes and JSON errors.
30. The frontend shows inline errors and loading states.
31. Passwords are hashed with bcrypt before storage.
32. It centralizes calls to the ML service so controllers stay clean.
33. It returns feature importance and reasons alongside the prediction.
34. Missing values are imputed in the preprocessing pipeline.
35. Joblib serializes Python ML pipelines reliably.
36. Normalization reduces duplication and keeps relational integrity.
37. The backend can fall back or fail gracefully if the ML service is down.
38. Docker Compose standardizes the local stack.
39. MVC-like separation makes the backend easier to maintain.
40. Add automated tests by layer: API, UI, DB, and model.
41. Add a role column and enforce it in `authorizeRoles()`.
42. Use `page` and `limit` parameters in the candidate query.
43. Add structured logs with request IDs and timestamps.
44. Store page events or usage counters in an analytics table.
45. Retrain by running `train.py` on new data and replacing the artifact.
46. Env vars keep secrets out of source control and enable environment-specific config.
47. Separate Python avoids mixing ML dependencies into Node.
48. The React form fields map directly to the database columns.
49. Use the same preprocessing and feature engineering at train and predict time.
50. The biggest design decision is splitting the system into UI, API, and ML layers.

#### Advanced answer key
1. Random Forest offers the best balance of performance and robustness for tabular screening data.
2. Cross-validation reduces the chance that one lucky split drives model choice.
3. Small or synthetic data can overstate performance and reduce real-world reliability.
4. Compare production input distributions to training distributions and monitor metrics over time.
5. Precision and recall should be tracked because shortlist errors have business cost.
6. Use class weights, better sampling, or threshold tuning.
7. Use feature importance, coefficients, rule inspection, and transparent scoring.
8. Explainability matters because recruiters need to trust shortlist decisions.
9. Keep preprocessing identical between train and inference and avoid leaking target-dependent features.
10. One-hot encoding is safer for unordered categories; label encoding can imply fake order.
11. Linear models are sensitive to scale; trees are much less sensitive.
12. Calibration tells you whether predicted probabilities are trustworthy.
13. ROC-AUC shows how well the model ranks good candidates above weak ones.
14. At scale, you would add indexing, partitioning, and perhaps archival tables.
15. Store candidate identity and prediction instances separately.
16. Version model rows and artifacts together with metrics and timestamps.
17. Add audit tables for request input, model version, and output.
18. Asynchronous training would keep long-running model jobs out of the request path.
19. Put Flask behind a secure internal network or reverse proxy.
20. Cache the loaded model and minimize payload size.
21. Scale backend and ML service independently because they have different workloads.
22. Keep JWT secrets in environment secrets, not source code.
23. Validate type, range, and presence on every prediction field.
24. Keep a rollback-friendly model registry and artifact history.
25. Explain the business problem, architecture, and measurable outcomes.
26. Emphasize the dataset, model comparison, and metric logic.
27. Focus on reusable UI, routing, and state management.
28. Focus on APIs, services, models, and security.
29. Focus on orchestration, observability, and deployment.
30. Prediction and authentication paths are the most production-sensitive.
31. The ML service or database connection will usually fail first if misconfigured.
32. Prediction history and model governance create the most long-term maintenance.
33. I would refactor repeated form logic and shared validation first.
34. Auditability matters when shortlist decisions must be reviewed.
35. The model bundle plus versioned metrics make the system reproducible.
36. Logs, prediction history, and model metrics create observability.
37. MySQL fits fixed relational entities and foreign keys better.
38. Deep learning was excluded by project constraints and is unnecessary for tabular screening.
39. OCR and resume parsing were excluded to keep the scope on structured ML only.
40. Structured candidate signals still support meaningful shortlist prediction.
41. Bulk upload could be added with CSV validation and background jobs.
42. Test the Flask endpoint with a known payload and expected response shape.
43. Test the Express endpoint with authenticated requests and history inserts.
44. Test the React page with mocked service responses and UI assertions.
45. Test debounced filtering and row rendering with sample records.
46. Test that charts render and update when analytics data changes.
47. Test password hashing, token issuance, and protected route redirects.
48. Test foreign keys, unique constraints, and cascades with sample inserts.
49. Test that the saved artifact is loaded and the winner model is reported.
50. I would say the next improvement is stronger monitoring, broader tests, and better model governance.

---

## 26. Code Walkthrough

### Best order to read the project
1. `README.md` - understand the business and architecture.
2. `database/schema.sql` - understand the data model.
3. `backend/package.json` and `backend/server.js` - understand the API entrypoint.
4. `backend/config/db.js` - understand database connectivity.
5. `backend/middleware/authMiddleware.js` - understand security.
6. `backend/models/*` - understand persistence.
7. `backend/controllers/*` - understand request logic.
8. `backend/routes/*` - understand endpoint mapping.
9. `backend/services/predictionService.js` - understand the Python bridge.
10. `ml-service/requirements.txt` and `ml-service/train.py` - understand training.
11. `ml-service/src/preprocessing.py` - understand data transformation.
12. `ml-service/src/feature_engineering.py` - understand derived features.
13. `ml-service/src/training.py` - understand model comparison.
14. `ml-service/src/prediction.py` - understand inference.
15. `ml-service/predict.py` - understand the Flask service.
16. `frontend/package.json` and `frontend/index.html` - understand the app shell.
17. `frontend/src/main.jsx` and `frontend/src/App.jsx` - understand routing.
18. `frontend/src/context/AuthContext.jsx` - understand auth state.
19. `frontend/src/services/*` - understand API calls.
20. `frontend/src/components/*` - understand reusable UI.
21. `frontend/src/pages/*` - understand page behavior.
22. `frontend/src/styles/index.css` - understand visual design.
23. `docker-compose.yml` - understand local orchestration.

### Why this order is best
This order goes from concept to data, backend, ML, frontend, and deployment. It mirrors how the app actually works, so the reader builds mental context instead of jumping randomly between files.

---

## 27. Final Summary

By the end of this README, you should understand:
- every folder,
- every file,
- every function,
- the MySQL schema,
- the ML pipeline,
- the React frontend,
- the Express backend,
- the Python ML service,
- how prediction requests flow,
- how to run and debug the project,
- how to talk about it in an interview confidently.

This project is a complete full stack classical machine learning system for recruiter shortlist prediction. It is intentionally modular so each layer can be explained, tested, deployed, and improved independently.
