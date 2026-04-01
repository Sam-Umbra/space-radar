package dev.umbra.space_radar_api.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import dev.umbra.space_radar_api.models.dtos.AsteroidData;
import tools.jackson.databind.JsonNode;

@Service
public class NasaService {

    private final RestClient restClient;

    @Value("${nasa_api_key}")
    private String apiKey;

    private LocalDate lastFetchDate;
    private int currentIndex;

    private List<AsteroidData> asteroidList = new ArrayList<>();

    public NasaService(RestClient restClient) {
        this.restClient = restClient;
    }

    public AsteroidData getNextAsteroid() {
        LocalDate today = LocalDate.now();

        if (asteroidList.isEmpty() || currentIndex >= asteroidList.size() || !today.equals(lastFetchDate)) {
            asteroidList = fetchNasaApi(today, today);
            currentIndex = 0;
            lastFetchDate = today;
        }

        if (asteroidList.isEmpty())
            return null;

        return asteroidList.get(currentIndex++);
    }

    private List<AsteroidData> fetchNasaApi(LocalDate startDate, LocalDate endDate) {
        try {
            JsonNode rawData = restClient.get()
                    .uri("https://api.nasa.gov/neo/rest/v1/feed", uriBuilder -> uriBuilder
                            .queryParam("start_date", startDate.toString())
                            .queryParam("end_date", endDate.toString())
                            .queryParam("api_key", apiKey)
                            .build())
                    .retrieve()
                    .body(JsonNode.class);

            return cleanNasaData(rawData);

        } catch (RestClientException e) {
            System.err.println("Error fetching Nasa Api: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    private List<AsteroidData> cleanNasaData(JsonNode data) {
        List<AsteroidData> list = new ArrayList<>();

        if (data == null || !data.has("near_earth_objects")) {
            return list;
        }

        JsonNode nearEarthObjects = data.path("near_earth_objects");

        nearEarthObjects.properties().forEach(entry -> {
            JsonNode asteroidsInDate = entry.getValue();

            if (asteroidsInDate.isArray()) {
                for (JsonNode asteroid : asteroidsInDate) {
                    // Chamada correta do seu método factory
                    list.add(AsteroidData.fromEntity(asteroid));
                }
            }
        });

        return list;
    }

}
