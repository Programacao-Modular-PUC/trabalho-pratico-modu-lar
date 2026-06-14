package hospedagem.controller;

import hospedagem.model.Quarto;
import hospedagem.model.TipoQuarto;
import hospedagem.repository.QuartoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/quartos")
public class QuartoController {

    private final QuartoRepository repository;

    public QuartoController(QuartoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Quarto> listar(@RequestParam(required = false) String tipo) {
        if (tipo == null || tipo.isBlank()) {
            return repository.findAll();
        }

        TipoQuarto tipoQuarto;
        try {
            tipoQuarto = TipoQuarto.valueOf(tipo.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Tipo de quarto inválido. Valores válidos: individual, duplo, familia");
        }

        return repository.findAll().stream()
                .filter(quarto -> quarto.getTipo() == tipoQuarto)
                .toList();
    }

    @PostMapping
    public Quarto salvar(@RequestBody Quarto quarto) {
        quarto.validarRecursosPermitidos();
        return repository.save(quarto);
    }

    @GetMapping("/{id}")
    public Quarto buscar(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quarto não encontrado"));
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Quarto não encontrado");
        }
        repository.deleteById(id);
    }
}
