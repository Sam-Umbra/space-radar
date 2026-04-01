package dev.umbra.space_radar_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@PropertySource("classpath:env.properties")
public class SpaceRadarApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpaceRadarApiApplication.class, args);
	}

}
