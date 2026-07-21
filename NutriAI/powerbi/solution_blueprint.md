# NutriAI Power BI Solution Blueprint

## 1. Business objective

Build an enterprise-grade analytics experience for NutriAI that helps stakeholders understand:

- User adoption and health profile trends
- Nutrition behavior and recommendation outcomes
- Diet recommendation performance
- Admin-level operational health

## 2. Source mapping from NutriAI backend

The Power BI model should consume data exported from these MongoDB collections:

- Users -> DimUser
- Health profiles -> FactDailyProgress and DimGoal / DimActivity / DimDietType
- Recommendations -> FactRecommendations
- Foods -> DimFood
- Daily meal plan payloads -> FactMeals and FactNutrition

## 3. Recommended star schema

### Fact tables

- FactRecommendations
  - RecommendationKey
  - UserKey
  - DateKey
  - GoalKey
  - DietTypeKey
  - ActivityKey
  - BMI
  - BMR
  - TDEE
  - DailyCalories
  - TargetProtein
  - TargetCarbohydrates
  - TargetFat
  - RecommendationStatus
  - CreatedAt

- FactMeals
  - MealKey
  - RecommendationKey
  - UserKey
  - DateKey
  - FoodKey
  - MealType
  - Calories
  - Protein
  - Carbohydrates
  - Fat
  - Fiber
  - Sugar
  - Sodium

- FactNutrition
  - NutritionKey
  - UserKey
  - DateKey
  - Calories
  - Protein
  - Fat
  - Carbohydrates
  - Fiber
  - Sugar
  - Sodium
  - WaterIntake

- FactDailyProgress
  - ProgressKey
  - UserKey
  - DateKey
  - Weight
  - Height
  - BMI
  - DailyCalories
  - Protein
  - Fat
  - Carbohydrates
  - WaterIntake
  - GoalAchievementPct

### Dimension tables

- DimUser
  - UserKey
  - UserId
  - Name
  - Email
  - Gender
  - Age
  - CreatedDate

- DimDate
  - DateKey
  - Date
  - Year
  - Quarter
  - Month
  - MonthName
  - Week
  - Day
  - IsWeekend

- DimFood
  - FoodKey
  - FoodId
  - FoodName
  - Category
  - MealType
  - FoodPreference
  - Calories
  - Protein
  - Carbohydrates
  - Fat
  - Fiber
  - Sugar
  - Sodium

- DimGoal
  - GoalKey
  - GoalName

- DimDietType
  - DietTypeKey
  - DietTypeName

- DimActivity
  - ActivityKey
  - ActivityName

## 4. Power Query transformation plan

Apply these steps to each imported table:

- Rename columns to model-friendly names
- Correct data types
- Remove nulls where appropriate
- Remove duplicates
- Create a calendar table based on the date range from recommendation and profile records
- Merge related tables such as recommendations with users and goals
- Append or union datasets when combining historical snapshots
- Create relationships between facts and dimensions

## 5. Suggested Power Query logic

### Profiles table transformation

- Convert height, weight, BMI, BMR, TDEE, and nutrition metrics to Decimal/Whole Number types
- Parse created_at into DateTime and Date
- Replace blank strings with null

### Recommendations table transformation

- Expand the nested daily_plan object into separate supporting columns
- Parse created_at to a proper date field
- Convert boolean flags to True/False
- Standardize diet and goal labels

### Foods table transformation

- Rename food_name to FoodName
- Normalize calories, protein, carbs, fat, fiber, sugar, sodium to numeric types
- Create a food category dimension if needed

## 6. DAX measure design

The DAX measures should include:

- Total Users
- Active Users
- Total Recommendations
- Recommendations Today
- Average BMI
- Average BMR
- Average TDEE
- Average Daily Calories
- Average Protein
- Average Fat
- Average Carbohydrates
- Average Water Intake
- Average Weight
- Average Height
- Calories Consumed
- Calories Burned
- Goal Achievement %

## 7. Dashboard page layout

### Page 1: User Dashboard

Visuals:
- KPI cards for current BMI, weight, calories, protein, fat, carbohydrates, water intake
- Line chart for daily calories
- Line chart for weekly nutrition
- Line chart for monthly nutrition
- Line chart for weight progress
- Line chart for BMI trend

### Page 2: Nutrition Dashboard

Visuals:
- Donut chart for calories distribution
- Donut chart for protein distribution
- Donut chart for fat distribution
- Donut chart for carbohydrate distribution
- Bar chart for fiber, sugar, sodium
- Treemap for top recommended foods
- Clustered column chart for most selected diet

### Page 3: Recommendation Dashboard

Visuals:
- Pie chart for recommendations by goal
- Donut chart for recommendations by diet
- Donut chart for recommendations by activity
- Line chart for daily, weekly, monthly recommendations
- KPI card for success rate
- Matrix for recommendation outcomes by goal and month

### Page 4: Admin Dashboard

Visuals:
- KPI cards for total users, total foods, recommendations generated, active sessions
- Bar chart for most popular foods
- KPI for average recommendation time
- Line chart for daily API requests
- Gauge for operational health

## 8. Filters and interactivity

Recommended filters:

- Date
- User
- Goal
- Diet Type
- Activity Level
- Gender
- Age

Interactivity features:

- Bookmarks
- Drill-through pages
- Tooltips
- Cross-filtering
- Synchronized slicers
- Navigation buttons

## 9. Theme

Use a modern healthcare-inspired theme:

- Green for wellness and health progress
- Blue for analytics and trust
- White for clean readability
- Rounded cards
- Professional layout

## 10. Performance best practices

- Use a star schema and avoid snowflake design
- Keep fact tables narrow and optimized
- Use integer surrogate keys for relationships
- Disable unnecessary columns in import
- Optimize DAX by avoiding row-by-row functions where possible
- Use summary tables for large historical data when needed
- Prepare for incremental refresh and future API-based refresh

## 11. Power BI Embedded integration plan for React

The Power BI report can be embedded in React using the Power BI Embedded JavaScript SDK, with:

- a report embed token generated by your backend
- a workspace ID and report ID from Power BI Service
- secure roles and row-level security if needed

Recommended architecture:

- Frontend React app embeds the report
- Backend issues embed tokens for authenticated users
- Power BI service handles rendering and visual interactions

