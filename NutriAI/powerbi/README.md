# NutriAI Power BI Solution

This folder contains a complete Power BI implementation blueprint for NutriAI, tailored to the backend data model and the analytics requirements you provided.

## What is included

- A star-schema design for the NutriAI analytics model
- Power Query transformation guidance for MongoDB-derived data
- DAX measures for user, nutrition, recommendation, and admin KPIs
- Dashboard page layout and visualization recommendations
- A MongoDB export script to prepare CSV datasets for Power BI import
- A React/Power BI Embedded integration plan

## Suggested workflow

1. Export MongoDB collections into CSV files using the Python script in this folder.
2. Import the CSV files into Power BI Desktop.
3. Build the model using the star schema described in the blueprint.
4. Create the dashboards for Users, Nutrition, Recommendations, and Admin.
5. Publish to Power BI Service and connect to Embedded for React.

## Files

- [powerbi/solution_blueprint.md](powerbi/solution_blueprint.md)
- [powerbi/export_mongodb_to_powerbi.py](powerbi/export_mongodb_to_powerbi.py)
- [powerbi/power_query_m_examples.txt](powerbi/power_query_m_examples.txt)
- [powerbi/dax_measures.dax](powerbi/dax_measures.dax)

## Notes

The backend currently stores users, health profiles, foods, and recommendations in MongoDB collections. The Power BI model is designed to work with those collections directly and to support future scheduled refresh or API-based refresh.
