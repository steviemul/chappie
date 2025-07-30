package io.steviemul.chappie.tools;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class WeatherTool {

  private static final String GEO_URL = "http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=5&appid={api_key}";
  private static final String WEATHER_URL = "https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={api_key}";

  @Tool(name = "Current weather lookup", description = "Looks up today's weather for the specified city")
  public Weather lookup(String city) {
    Location location = getLocation(city);
    Weather weather = getWeather(location);

    log.info("Current weather is {}", weather);

    return weather;
  }

  private Weather getWeather(Location location) {
    RestTemplate restTemplate = new RestTemplate();

    return restTemplate.getForObject(
        GEO_URL, Weather.class,
        Map.of("lat", location.lat(), "lon", location.lon(), "api_key", ""));
  }

  private Location getLocation(String city) {

    RestTemplate restTemplate = new RestTemplate();

    List<Location> response = restTemplate.getForObject(
        GEO_URL, new ArrayList<>().getClass(),
        Map.of("city", city, "api_key", "9d0220a01b6485088d44d4f72071819a"));

    return response.get(0);
  }

  private record Weather(Current current) {}

  private record Current(double temp, int pressure, int humidity, double wind_speed) {}

  private record Location(String name, double lat, double lon) {}
}
