from enum import Enum
import pprint
from pydoc import text
from click import Option
from pydantic import BaseModel, Field, root_validator
from typing import Optional, Any, Union, Literal, Annotated, Dict, List
import json


class IngredientTexture(str, Enum):
    SMOOTH = 'smooth'
    CREAMY = 'creamy'
    SYRUPY = 'syrupy'
    LIQUID = 'liquid'
    JELLY = 'jelly'
    SPARKLING = 'sparkling'

class IngredientClarity(str, Enum):
    CLEAR = 'clear'
    CLOUDY = 'cloudy'
    HAZY = 'hazy'
    OPAQUE = 'opaque'

class AlchoholType(str, Enum):
    SPIRITS = 'spirits'
    WINE = 'wine'
    BEER = 'beer'
    LIQUEUR = 'liqueur'
    VODKA = 'vodka'
    GIN = 'gin'
    RUM = 'rum'
    WHISKEY = 'whiskey'
    TEQUILA = 'tequila'

class OriginType(str, Enum):
    FRUIT = 'fruit'
    HERB = 'herb'
    SPICE = 'spice'
    DAIRY = 'dairy'
    SWEETENER = 'sweetener'
    MIXER = 'mixer'
    GARNISH = 'garnish'

class Season(str, Enum):
    SPRING = 'spring'
    SUMMER = 'summer'
    AUTUMN = 'autumn'
    WINTER = 'winter'
    ALL = 'all'


class IngredientFlavors(BaseModel):
    sweet: Optional[float] = None
    sour: Optional[float] = None
    bitter: Optional[float] = None
    salty: Optional[float] = None
    umami: Optional[float] = None

    citrusy: Optional[float] = None
    tart: Optional[float] = None
    fruity: Optional[float] = None
    herbal: Optional[float] = None
    spicy: Optional[float] = None
    floral: Optional[float] = None
    woody: Optional[float] = None
    smoky: Optional[float] = None

class IngredientCharacteristics(BaseModel):
    type: Literal["characteristics"] = "characteristics"

    flavors: IngredientFlavors # primary tastes and secondary flavors. Could be split into two fields
    flavors_other: Optional[List[str]] = None

    origin_type: Optional[OriginType] = None

    alcoholic: bool
    alcohol_type: Optional[AlchoholType] = None

    clarity: Optional[IngredientClarity] = None
    texture: Optional[IngredientTexture] = None
    
    season: Optional[Season] = None

    

    @root_validator(pre=True)
    def validate_fields(cls, values):
        # Validate fields that are enums
        enum_fields = {
            'texture': IngredientTexture,
            'clarity': IngredientClarity,
            'alcohol_type': AlchoholType,
            'origin_type': OriginType,
            'season': Season
        }
        
        for field, enum in enum_fields.items():
            value = values.get(field)
            if value and value not in enum.__members__.values():
                print(f"Invalid value for {field}: {value}")
                values[field] = None

        return values

    
    def to_json(self):
        return json.dumps(
            self,
            default=lambda o: o.__dict__, 
            sort_keys=True,
            indent=4)


class Error(BaseModel):
    type: Literal["error"] = "error"
    error: str
    
    def to_json(self):
        return json.dumps(
            self,
            default=lambda o: o.__dict__, 
            sort_keys=True,
            indent=4)

class IngredientCharacteristicsResult(BaseModel):
    name: str
    result: Annotated[Union[IngredientCharacteristics, Error], Field(discriminator='type')]
    confidence: float
    #result: IngredientCharacteristics

    def to_json(self):
        return json.dumps(
            self,
            default=lambda o: o.__dict__, 
            sort_keys=True,
            indent=4)