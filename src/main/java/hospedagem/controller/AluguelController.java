package hospedagem.controller;

import hospedagem.model.Aluguel;
import hospedagem.notificacao.EventoNotificacao;
import hospedagem.notificacao.GerenciadorNotificacoes;
import hospedagem.repository.AluguelRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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

    @GetMapping("/cliente/{clienteId}")
    public List<Aluguel> historicoPorCliente(@PathVariable Long clienteId) {
        return repository.findByClienteId(clienteId);
    }

    @PostMapping
    public Aluguel salvar(@RequestBody Aluguel aluguel) {
        aluguel.validarDisponibilidade(repository.findAll());
        Aluguel salvo = repository.save(aluguel);
        GerenciadorNotificacoes.getInstance().notificar(
                EventoNotificacao.RESERVA_CRIADA,
                "cliente",
                "Reserva criada com sucesso"
        );
        return salvo;
    }

    @PatchMapping("/{id}/cancelar")
    public Aluguel cancelar(@PathVariable Long id) {
        Aluguel aluguel = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluguel não encontrado"));

        if (aluguel.isCancelado()) {
            return aluguel;
        }

        aluguel.setCancelado(true);
        Aluguel salvo = repository.save(aluguel);
        GerenciadorNotificacoes.getInstance().notificar(
                EventoNotificacao.RESERVA_CANCELADA,
                "cliente",
                "Reserva cancelada com sucesso"
        );
        return salvo;
    }
}
