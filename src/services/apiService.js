import axios from "axios";
import images from "../../assets/images";

const FAKE_STORE_API_URL = "https://fakestoreapi.com";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5";
const WEATHER_API_KEY = "102ba968dda1c16749e1874591b205eb";

const LOCATION_MAPPING = {
  electronics: {
    city: "Tokyo",
    country: "Japan",
    coords: { lat: 35.6762, lon: 139.6503 },
  },
  jewelery: {
    city: "Dubai",
    country: "UAE",
    coords: { lat: 25.2048, lon: 55.2708 },
  },
  "men's clothing": {
    city: "Milan",
    country: "Italy",
    coords: { lat: 45.4642, lon: 9.19 },
  },
  "women's clothing": {
    city: "Paris",
    country: "France",
    coords: { lat: 48.8566, lon: 2.3522 },
  },
};

const getCategoryAmenities = (category) => {
  const amenities = {
    electronics: [
      "Smart Room Controls",
      "High-Speed WiFi",
      "Entertainment System",
    ],
    jewelery: ["Luxury Spa", "Private Pool", "Fine Dining"],
    "men's clothing": ["Business Center", "Fitness Center", "Executive Lounge"],
    "women's clothing": ["Shopping Mall Access", "Beauty Salon", "Rooftop Bar"],
  };
  return amenities[category] || ["WiFi", "Restaurant", "Room Service"];
};

const getHotelImages = (category) => {
  const imageMapping = {
    electronics: [
      images.explore.rect783,
      images.explore.rect784,
      images.explore.rect785,
      images.explore.rect786,
    ],
    jewelery: [
      images.explore.group10117,
      images.explore.group10118,
      images.explore.group10127,
      images.explore.image1_3,
    ],
    "men's clothing": [
      images.explore.image1,
      images.explore.image13,
      images.explore.image14,
      images.explore.image4,
    ],
    "women's clothing": [
      images.explore.pexels221457,
      images.explore.rect783,
      images.explore.rect784,
      images.explore.rect785,
    ],
  };
  return imageMapping[category] || imageMapping.electronics;
};

export const fetchRecommendedHotels = async () => {
  try {
    const response = await axios.get(`${FAKE_STORE_API_URL}/products`);

    const hotels = response.data.map((product) => {
      const location = LOCATION_MAPPING[product.category] || {
        city: "New York",
        country: "USA",
        coords: { lat: 40.7128, lon: -74.006 },
      };

      const hotelImages = getHotelImages(product.category);

      return {
        id: product.id.toString(),
        name: product.title.substring(0, 30) + "...", 
        price: Math.round(product.price * 10), 
        rating: product.rating.rate,
        ratingCount: product.rating.count,
        location: `${location.city}, ${location.country}`,
        description: product.description,
        coords: location.coords,
        amenities: getCategoryAmenities(product.category),
        mainImage: hotelImages[0],
        images: hotelImages,
        originalImage: product.image,
      };
    });

    return hotels;
  } catch (error) {
    console.error("Error fetching recommended hotels:", error);
    // Fallback data in case of API failure
    return [
      {
        id: "1",
        name: "Luxury Resort & Spa",
        price: 299,
        rating: 4.8,
        ratingCount: 128,
        location: "Bali, Indonesia",
        description:
          "Experience luxury and comfort in our well-appointed rooms with modern amenities and spectacular views.",
        coords: { lat: -8.4095, lon: 115.1889 },
        amenities: ["Pool", "Spa", "Restaurant"],
        mainImage: images.explore.rect783,
        images: [
          images.explore.rect783,
          images.explore.rect784,
          images.explore.rect785,
          images.explore.rect786,
        ],
      },
    ];
  }
};

export const fetchWeatherForLocation = async (lat, lon) => {
  try {
    const response = await axios.get(`${WEATHER_API_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: "metric",
      },
    });

    return {
      temperature: response.data.main.temp,
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Return fallback weather data
    return {
      temperature: 28,
      condition: "Sunny",
      description: "Clear sky",
      icon: "01d",
      humidity: 65,
      windSpeed: 5.2,
    };
  }
};
