package ar.edu.utn.frc.tup.lciii.repository;

import ar.edu.utn.frc.tup.lciii.entities.PublicationEntity;
import ar.edu.utn.frc.tup.lciii.entities.SectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<SectionEntity,Long> {
    List<SectionEntity> findAllByPublication(PublicationEntity publication);
}