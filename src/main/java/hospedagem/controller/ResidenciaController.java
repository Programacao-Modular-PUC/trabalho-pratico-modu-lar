package hospedagem.controller;

import hospedagem.model.Residencia;
import hospedagem.repository.ResidenciaRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/residencias")
public class ResidenciaController {

    private final ResidenciaRepository repository;

    public ResidenciaController(ResidenciaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Residencia> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Residencia salvar(@RequestBody Residencia residencia) {
        return repository.save(residencia);
    }
}