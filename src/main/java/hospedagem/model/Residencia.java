package hospedagem.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Residencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String endereco;

    @OneToMany
    private List<Quarto> quartos;

    // getters e setters
}