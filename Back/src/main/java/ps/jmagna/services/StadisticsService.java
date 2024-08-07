package ps.jmagna.services;

import ps.jmagna.dtos.stadistics.StatDto;
import ps.jmagna.dtos.stadistics.StatSeriesDto;
import ps.jmagna.dtos.stadistics.StatsResponce;
import ps.jmagna.entities.*;
import ps.jmagna.enums.PubType;
import ps.jmagna.repository.PublicationRepository;
import ps.jmagna.repository.SaleRepository;
import ps.jmagna.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class StadisticsService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    PublicationRepository publicationRepository;
    @Autowired
    SaleRepository saleRepository;

    public StatsResponce getUserStadistics(int year) {
        StatSeriesDto[] stats = new StatSeriesDto[2];
        StatDto[] vals = {new StatDto("Enero"),
                new StatDto("Febrero"),
                new StatDto("Marzo"),
                new StatDto("Abril"),
                new StatDto("Mayo"),
                new StatDto("Junio"),
                new StatDto("Julio"),
                new StatDto("Agosto"),
                new StatDto("Septiembre"),
                new StatDto("Octubre"),
                new StatDto("Noviembre"),
                new StatDto("Diciembre"),
        };
        StatDto[] vals2 = {new StatDto("Enero"),
                new StatDto("Febrero"),
                new StatDto("Marzo"),
                new StatDto("Abril"),
                new StatDto("Mayo"),
                new StatDto("Junio"),
                new StatDto("Julio"),
                new StatDto("Agosto"),
                new StatDto("Septiembre"),
                new StatDto("Octubre"),
                new StatDto("Noviembre"),
                new StatDto("Diciembre"),
        };

        YearMonth last = YearMonth.from(LocalDateTime.of(year, 12, 1, 0, 0));
        int lastday = last.atEndOfMonth().getDayOfMonth();
        List<UserEntity> entities = userRepository.findAllByDateTimeBetween(
                LocalDateTime.of(year, 1, 1, 0, 0),
                LocalDateTime.of(year, 12, lastday, 23, 59));

        if (entities.isEmpty()) {
            return new StatsResponce(null, true);
        }

        for (UserEntity e : entities) {
            BigDecimal v = vals[e.getDateTime().getMonthValue() - 1].getValue();
            v = v.add(BigDecimal.ONE);
            vals[e.getDateTime().getMonthValue() - 1].setValue(v);
            vals2[e.getDateTime().getMonthValue() - 1].setValue(v);
        }
        stats[0] = new StatSeriesDto("diary", Arrays.stream(vals).toList());

        vals2[0].setValue(vals[0].getValue());
        for (int i = 1; i < vals2.length; i++) {
            vals2[i].setValue(vals2[i].getValue().add(vals2[i - 1].getValue()));
        }
        stats[1] = new StatSeriesDto("anual", Arrays.stream(vals2).toList());

        return new StatsResponce(Arrays.stream(stats).toList(), false);
    }

    public StatsResponce getPublicationStadistics(int year, int month) {
        StatSeriesDto stats = new StatSeriesDto();
        StatDto[] vals = {new StatDto("Artisticas"),
                new StatDto("Cientificas"),
                new StatDto("Tecnológicas"),
                new StatDto("Otro"),
        };

        YearMonth last = YearMonth.from(LocalDateTime.of(year, month, 1, 0, 0));
        int lastday = last.atEndOfMonth().getDayOfMonth();
        List<PublicationEntity> entities =
                publicationRepository.findAllByDateTimeBetween(
                        LocalDateTime.of(year, month, 1, 0, 0),
                        LocalDateTime.of(year, month, lastday, 23, 59));

        if (entities.isEmpty()) {
            return new StatsResponce(null, true);
        }

        for (PublicationEntity p : entities) {
            int i = p.getType().ordinal();
            BigDecimal v = vals[i - 1].getValue().add(BigDecimal.ONE);
            vals[i - 1].setValue(v);
        }

        stats.setName("count");
        stats.setSeries(Arrays.stream(vals).toList());

        return new StatsResponce(List.of(stats), false);
    }

    public StatsResponce getSellsStadistics(PubType type, String firstDate, String lastDate) {


        LocalDateTime date1 = LocalDateTime.parse(firstDate, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
        LocalDateTime date2 = LocalDateTime.parse(lastDate, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));


        List<StatDto> vals = new ArrayList<>();
        List<StatDto> vals2 = new ArrayList<>();
        for (LocalDate l : getFullWeeks(date1.toLocalDate(), date2.toLocalDate())) {
            vals.add(new StatDto(l.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))));
            vals2.add(new StatDto(l.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))));
        }

        List<SaleEntity> entities = saleRepository.findAllByDateTimeBetween(date1, date2);

        if (entities.isEmpty()) {
            return new StatsResponce(null, true);
        }

        for (SaleEntity sale : entities) {

            DayOfWeek dayOfWeek = sale.getDateTime().getDayOfWeek();
            LocalDateTime firstDayOfWeek = sale.getDateTime().minusDays(dayOfWeek.getValue() - 1);

            Optional<StatDto> statFind = vals.stream()
                    .filter(d -> d.getName()
                            .equals(firstDayOfWeek.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))))
                    .findFirst();

            Optional<StatDto> statFind2 = vals2.stream()
                    .filter(d -> d.getName()
                            .equals(firstDayOfWeek.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))))
                    .findFirst();

            if (statFind.isEmpty()) continue;

            BigDecimal count = vals.get(vals.indexOf(statFind.get())).getValue();
            BigDecimal total = vals2.get(vals2.indexOf(statFind2.get())).getValue();
            for (SaleDetailEntity d : sale.getDetails()) {
                if(type.equals(PubType.NONE) || d.getPublication().getType().equals(type)){
                    total = total.add(d.getTotal());
                    count = count.add(BigDecimal.ONE);
                }
            }

            vals.get(vals.indexOf(statFind.get())).setValue(
                    count
            );

            vals2.get(vals2.indexOf(statFind2.get())).setValue(
                    total
            );
        }

        StatSeriesDto stats = new StatSeriesDto();
        stats.setName("count");
        stats.setSeries(vals);

        StatSeriesDto stats2 = new StatSeriesDto();
        stats2.setName("total");
        stats2.setSeries(vals2);


        return new StatsResponce(List.of(stats, stats2), false);
    }

    public List<LocalDate> getFullWeeks(LocalDate d1, LocalDate d2) {
        List<LocalDate> list = new ArrayList<>();
        // Obtener el primer día de la primera semana del año
        LocalDate firstDayOfFirstWeek = d1.with(
                TemporalAdjusters.previousOrSame(
                        LocalDate.of(d1.getYear(), 1, 1).getDayOfWeek()));

        // Obtener el último día de la última semana del año
        LocalDate lastDayOfLastWeek = d2.with(
                TemporalAdjusters.nextOrSame(
                        LocalDate.of(d2.getYear(), 12, 31).getDayOfWeek()));

        // Iterar sobre todas las semanas entre las fechas de inicio y fin
        LocalDate currentDate = firstDayOfFirstWeek;
        while (!currentDate.isAfter(lastDayOfLastWeek.minusWeeks(1))) {
            // Imprimir la semana actual
            LocalDate startOfWeek = currentDate;
//            System.out.println("Semana: " + startOfWeek + " - " + endOfWeek);

            list.add(startOfWeek);
            // Pasar a la siguiente semana
            currentDate = currentDate.plusWeeks(1);
        }
        return list;
    }
}
