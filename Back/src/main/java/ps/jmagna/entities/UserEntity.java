package ps.jmagna.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Formula;
import ps.jmagna.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String username;
    @Enumerated(EnumType.STRING)
    private UserRole role;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    LocalDateTime dateTime;
    String email;
    String password;
    @Lob
    byte[] icon;

    //UserData
    String name;
    String lastname;
    String phone;
    String dni;
    String dniType;

    //Direction
    @ManyToOne
    @JoinColumn(name="idState")
    StateEntity state;
    String direction;
    String numberDir;
    String postalNum;
    String floor;
    String room;

    //ComercialData
    String cvu;


    @Formula("(SELECT COUNT(p.id) FROM publications p WHERE p.id_user = id)")
    int pubs;
    @Formula("(SELECT COUNT(s.id) FROM publications p " +
            "JOIN sale_details s ON p.id = s.id_publication WHERE p.id_user = id)")
    int sells;
    @Formula("(SELECT COUNT(s.id) FROM sales s WHERE s.id_user = id)")
    int buys;

    public UserEntity(String username, String email, String password, UserRole role, LocalDateTime dateTime) {
        this.username = username;
        this.role = role;
        this.dateTime = dateTime;
        this.email = email;
        this.password = password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == UserRole.ADMIN) {
            return List.of(new SimpleGrantedAuthority("ADMIN"), new SimpleGrantedAuthority("USER"));
        }
        if (this.role == UserRole.DELIVERY) {
            return List.of(new SimpleGrantedAuthority("DELIVERY"), new SimpleGrantedAuthority("USER"));
        }
        return List.of(new SimpleGrantedAuthority("USER"));
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
