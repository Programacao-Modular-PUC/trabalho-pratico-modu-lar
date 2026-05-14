package hospedagem.controller;

import hospedagem.model.Aluguel;
import hospedagem.repository.AluguelRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alugueis")
public class AluguelController {

    private final AluguelRepository repository;

    public AluguelController(AluguelRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Aluguel> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Aluguel salvar(@RequestBody Aluguel aluguel) {
        return repository.save(aluguel);
    }
}