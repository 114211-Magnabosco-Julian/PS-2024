package ps.jmagna.dtos.purchase;

import ps.jmagna.enums.SaleState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaleDto {
    Long id;
    String dateTime;
    List<SaleDetailDto> details;
    SaleState saleState;
    BigDecimal total;
}
