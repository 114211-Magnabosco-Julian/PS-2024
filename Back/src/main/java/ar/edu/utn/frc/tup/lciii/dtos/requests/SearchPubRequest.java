package ar.edu.utn.frc.tup.lciii.dtos.requests;

import ar.edu.utn.frc.tup.lciii.enums.TypePub;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SearchPubRequest {
    String text;
    String materials;
    TypePub type;
    int diffMin;
    int diffMax;
    BigDecimal points;
    boolean mine;
    int page;
    int size;
}
