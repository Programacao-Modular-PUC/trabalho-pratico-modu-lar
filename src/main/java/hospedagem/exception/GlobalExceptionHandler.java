package hospedagem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(QuartoIndisponivelException.class)
    public ResponseEntity<Map<String, String>> tratarQuartoIndisponivel(QuartoIndisponivelException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("erro", exception.getMessage()));
    }

    @ExceptionHandler({
            CapacidadeExcedidaException.class,
            DataInvalidaException.class,
            RecursoNaoPermitidoException.class,
            IllegalArgumentException.class
    })
    public ResponseEntity<Map<String, String>> tratarRequisicaoInvalida(RuntimeException exception) {
        return ResponseEntity.badRequest().body(Map.of("erro", exception.getMessage()));
    }
}
