package dev.umbra.space_radar_api.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import dev.umbra.space_radar_api.models.dtos.AsteroidData;
import dev.umbra.space_radar_api.models.dtos.PredictionResponse;

@Service
public class ModelIntegrationService {

    private final RestClient restClient;

    @Value("${ml_http_url}")
    private String modelUrl;

    public ModelIntegrationService(RestClient restClient) {
        this.restClient = restClient;
    }

    public PredictionResponse predictAsteroidHazard(AsteroidData data) {
        try {
            return restClient.post()
                    .uri(this.modelUrl)
                    .body(data)
                    .retrieve()
                    .body(PredictionResponse.class);
        } catch (RestClientException e) {
            System.err.println("Communication error with prediction model: " + e.getMessage());
            throw new RestClientException("Prediction model inaccessible", e);
        }
    }

}
