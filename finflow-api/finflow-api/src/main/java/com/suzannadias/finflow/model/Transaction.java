package com.suzannadias.finflow.model;

	import java.math.BigDecimal;
	import java.time.LocalDate;

	import jakarta.persistence.*;
	import jakarta.validation.constraints.*;

	@Entity
	@Table(name = "transactions")
	public class Transaction {

	    public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getDescription() {
			return description;
		}

		public void setDescription(String description) {
			this.description = description;
		}

		public BigDecimal getAmount() {
			return amount;
		}

		public void setAmount(BigDecimal amount) {
			this.amount = amount;
		}

		public String getCategory() {
			return category;
		}

		public void setCategory(String category) {
			this.category = category;
		}

		public TransactionType getType() {
			return type;
		}

		public void setType(TransactionType type) {
			this.type = type;
		}

		public LocalDate getDate() {
			return date;
		}

		public void setDate(LocalDate date) {
			this.date = date;
		}

		@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @NotBlank(message = "A descrição é obrigatória")
	    private String description;

	    @NotNull(message = "O valor é obrigatório")
	    @Positive(message = "O valor deve ser maior que zero")
	    private BigDecimal amount;

	    @NotBlank(message = "A categoria é obrigatória")
	    private String category;

	    @NotNull(message = "O tipo é obrigatório")
	    @Enumerated(EnumType.STRING)
	    private TransactionType type;

	    @NotNull(message = "A data é obrigatória")
	    private LocalDate date;
	}

