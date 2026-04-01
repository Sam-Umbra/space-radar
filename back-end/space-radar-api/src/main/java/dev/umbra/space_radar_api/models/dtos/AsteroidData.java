package dev.umbra.space_radar_api.models.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import tools.jackson.databind.JsonNode;

public record AsteroidData(
                @JsonProperty("est_diameter_min") double estDiameterMin,

                @JsonProperty("est_diameter_max") double estDiameterMax,

                @JsonProperty("relative_velocity") double relativeVelocity,

                @JsonProperty("miss_distance") double missDistance,

                @JsonProperty("absolute_magnitude") double absoluteMagnitude) {

        private static final String stdMeasurementUnit = "kilometers";
        private static final String stdVelocity = "kilometers_per_hour";

        public static AsteroidData fromEntity(JsonNode asteroid) {
                return new AsteroidData(
                                asteroid.path("estimated_diameter").path(stdMeasurementUnit)
                                                .path("estimated_diameter_min")
                                                .asDouble(),
                                asteroid.path("estimated_diameter").path(stdMeasurementUnit)
                                                .path("estimated_diameter_max")
                                                .asDouble(),
                                asteroid.path("close_approach_data").get(0).path("relative_velocity").path(stdVelocity)
                                                .asDouble(),
                                asteroid.path("close_approach_data").get(0).path("miss_distance")
                                                .path(stdMeasurementUnit)
                                                .asDouble(),
                                asteroid.path("absolute_magnitude_h").asDouble());
        }

}