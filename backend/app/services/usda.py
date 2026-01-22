"""
USDA FoodData Central API service
"""
import httpx
from typing import Optional, List
from app.config import settings


class USDAService:
    """Service for interacting with USDA FoodData Central API"""

    BASE_URL = "https://api.nal.usda.gov/fdc/v1"

    def __init__(self):
        self.api_key = settings.USDA_API_KEY

    async def search_foods(self, query: str, page_size: int = 10) -> List[dict]:
        """
        Search for foods in USDA database

        Args:
            query: Food name to search for
            page_size: Number of results to return

        Returns:
            List of food items with basic info
        """
        if not self.api_key:
            return [{
                "description": "USDA API not configured",
                "fdcId": 0,
                "dataType": "error"
            }]

        url = f"{self.BASE_URL}/foods/search"
        params = {
            "api_key": self.api_key,
            "query": query,
            "pageSize": page_size,
            "dataType": ["Foundation", "SR Legacy"]  # Most reliable data types
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()
                return data.get("foods", [])
        except Exception as e:
            return [{
                "description": f"Error: {str(e)}",
                "fdcId": 0,
                "dataType": "error"
            }]

    async def get_food_details(self, fdc_id: int) -> Optional[dict]:
        """
        Get detailed nutrition information for a specific food

        Args:
            fdc_id: FoodData Central ID

        Returns:
            Detailed food information including all nutrients
        """
        if not self.api_key:
            return None

        url = f"{self.BASE_URL}/food/{fdc_id}"
        params = {"api_key": self.api_key}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                return response.json()
        except Exception as e:
            return {"error": str(e)}

    def parse_nutrition(self, food_data: dict) -> dict:
        """
        Parse USDA food data into simplified nutrition info

        Args:
            food_data: Raw USDA food data

        Returns:
            Dict with calories, protein, carbs, fat, fiber
        """
        nutrients = food_data.get("foodNutrients", [])
        nutrition = {
            "calories": 0.0,
            "protein": 0.0,
            "carbs": 0.0,
            "fat": 0.0,
            "fiber": 0.0
        }

        # Map USDA nutrient IDs to our fields
        nutrient_map = {
            "Energy": "calories",
            "Protein": "protein",
            "Carbohydrate, by difference": "carbs",
            "Total lipid (fat)": "fat",
            "Fiber, total dietary": "fiber"
        }

        for nutrient in nutrients:
            name = nutrient.get("nutrientName", "")
            for usda_name, our_name in nutrient_map.items():
                if usda_name in name:
                    nutrition[our_name] = nutrient.get("value", 0.0)
                    break

        return nutrition


# Singleton instance
usda_service = USDAService()