package hospedagem.controller;

import hospedagem.model.Quarto;
import hospedagem.repository.QuartoRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quartos")
public class QuartoController {

    private final QuartoRepository repository;

    public QuartoController(QuartoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Quarto> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Quarto salvar(@RequestBody Quarto quarto) {
        return repository.save(quarto);
    }

    @GetMapping("/{id}")
    public Quarto buscar(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}