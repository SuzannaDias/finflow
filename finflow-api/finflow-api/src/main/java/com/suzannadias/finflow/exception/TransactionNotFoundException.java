package com.suzannadias.finflow.exception;

public class TransactionNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public TransactionNotFoundException(Long id) {
        super("Transação não encontrada: " + id);
    }
}
