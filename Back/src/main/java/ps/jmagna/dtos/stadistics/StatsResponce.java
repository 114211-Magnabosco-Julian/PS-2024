package ps.jmagna.dtos.stadistics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatsResponce {
    List<StatSeriesDto> stats;

    boolean nodata = false;
}
