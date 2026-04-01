package dev.umbra.space_radar_api.services;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import dev.umbra.space_radar_api.models.dtos.PredictionResponse;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void radarAnalysis(PredictionResponse result) {
        messagingTemplate.convertAndSend("/radar/prediction", result);
        System.out.println("Succesful transmission. Is the asteroid potentially dangerous: " + result.isPotentiallyHazardous());
    }

}
