package hospedagem.repository;

import hospedagem.model.Residencia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResidenciaRepository extends JpaRepository<Residencia, Long> {
}