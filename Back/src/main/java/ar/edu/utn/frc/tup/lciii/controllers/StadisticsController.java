package ar.edu.utn.frc.tup.lciii.controllers;

import ar.edu.utn.frc.tup.lciii.dtos.ListUsersResponce;
import ar.edu.utn.frc.tup.lciii.dtos.stadistics.StatSeriesDto;
import ar.edu.utn.frc.tup.lciii.dtos.stadistics.StatsResponce;
import ar.edu.utn.frc.tup.lciii.services.impl.AuthService;
import ar.edu.utn.frc.tup.lciii.services.impl.StadisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/stats")
public class StadisticsController {
    @Autowired
    private StadisticsService service;
    @GetMapping("/users/{year}")
    public StatsResponce getAll(@PathVariable int year) {
        return service.getUserStadistics(year);
    }
    @GetMapping("/pubs/{year}/{month}")
    public StatsResponce getAll(@PathVariable int year,@PathVariable int month) {
        return service.getPublicationStadistics(year,month);
    }
    @GetMapping("/sells")
    public StatsResponce getAll(@RequestParam String date1,@RequestParam String date2) {
        return service.getSellsStadistics(date1,date2);
    }
}
