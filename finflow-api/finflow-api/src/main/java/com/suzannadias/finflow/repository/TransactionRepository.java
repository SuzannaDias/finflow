package com.suzannadias.finflow.repository;

	import java.util.List;

	import org.springframework.data.jpa.repository.JpaRepository;

	import com.suzannadias.finflow.model.Transaction;
	import com.suzannadias.finflow.model.TransactionType;

	public interface TransactionRepository extends JpaRepository<Transaction, Long> {

	    List<Transaction> findByType(TransactionType type);

	    List<Transaction> findByCategory(String category);

	    List<Transaction> findByTypeAndCategory(TransactionType type, String category);
	}

