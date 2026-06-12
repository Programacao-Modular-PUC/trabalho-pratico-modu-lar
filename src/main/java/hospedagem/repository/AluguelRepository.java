package hospedagem.repository;

import hospedagem.model.Aluguel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AluguelRepository extends JpaRepository<Aluguel, Long> {
    List<Aluguel> findByClienteId(Long clienteId);
}