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
            # Include more data types for better coverage
            # Removed dataType filter to get all available foods
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()

                # Process foods to include calorie information
                foods = data.get("foods", [])
                processed_foods = []
                seen_descriptions = set()  # For simple deduplication

                for food in foods:
                    calories = self._extract_calories(food)

                    # Format description with proper capitalization
                    description = food.get("description", "Unknown Food")
                    description = self._format_description(description)

                    # Build contextual information
                    data_type = food.get("dataType", "")
                    brand = food.get("brandOwner", "")
                    if brand:
                        brand = self._clean_brand_name(brand)

                    # Create detailed description
                    # Only add brand name for branded foods, no labels for USDA data
                    detailed_desc = description
                    if brand:
                        detailed_desc = f"{description} ({brand})"

                    # Simple deduplication: skip very similar descriptions
                    # Create a normalized key for comparison
                    normalized_key = detailed_desc.lower().replace(" ", "")
                    if normalized_key in seen_descriptions:
                        continue
                    seen_descriptions.add(normalized_key)

                    food_item = {
                        "fdcId": food.get("fdcId"),
                        "description": detailed_desc,
                        "dataType": data_type,
                        "brandOwner": brand,
                        "calories": calories
                    }
                    processed_foods.append(food_item)

                return processed_foods
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

    def _clean_brand_name(self, brand: str) -> str:
        """
        Clean brand name by removing corporate suffixes

        Args:
            brand: Raw brand name

        Returns:
            Cleaned brand name
        """
        if not brand:
            return ""

        # Remove common corporate suffixes
        suffixes_to_remove = [
            ', Inc.', ' Inc.', ', Inc', ' Inc',
            ', LLC', ' LLC',
            ', Ltd.', ' Ltd.', ', Ltd', ' Ltd',
            ', Co.', ' Co.',
            ', Corp.', ' Corp.',
            ', Corporation', ' Corporation',
            ', L.L.C.', ' L.L.C.',
        ]

        cleaned = brand
        for suffix in suffixes_to_remove:
            if cleaned.endswith(suffix):
                cleaned = cleaned[:-len(suffix)]

        return cleaned.strip()

    def _format_description(self, description: str) -> str:
        """
        Format food description with proper capitalization

        Args:
            description: Raw food description

        Returns:
            Formatted description with title case
        """
        if not description:
            return "Unknown Food"

        # Convert to title case, but handle special cases
        # First, convert to lowercase
        desc = description.lower()

        # Split into words and capitalize appropriately
        words = desc.split()
        formatted_words = []

        # Words that should stay lowercase (unless at start)
        lowercase_words = {'with', 'and', 'or', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'by'}

        for i, word in enumerate(words):
            # First word or not in lowercase set: capitalize
            if i == 0 or word not in lowercase_words:
                formatted_words.append(word.capitalize())
            else:
                formatted_words.append(word)

        return ' '.join(formatted_words)

    def _extract_calories(self, food_item: dict) -> Optional[float]:
        """
        Extract calories from a food search result

        Args:
            food_item: Food item from search results

        Returns:
            Calories per 100g or None
        """
        nutrients = food_item.get("foodNutrients", [])
        for nutrient in nutrients:
            # Look for Energy/Calories
            name = nutrient.get("nutrientName", "").lower()
            if "energy" in name or "calorie" in name:
                # Prefer kcal over kJ
                unit = nutrient.get("unitName", "").lower()
                if "kcal" in unit or "calorie" in unit:
                    return nutrient.get("value", 0.0)

        return None

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