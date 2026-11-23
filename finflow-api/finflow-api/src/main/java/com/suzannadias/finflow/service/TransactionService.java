package com.suzannadias.finflow.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.suzannadias.finflow.model.Transaction;
import com.suzannadias.finflow.model.TransactionType;
import com.suzannadias.finflow.repository.TransactionRepository;

@Service
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public List<Transaction> list(TransactionType type, String category) {
        if (type != null && category != null) {
            return repository.findByTypeAndCategory(type, category);
        }
        if (type != null) {
            return repository.findByType(type);
        }
        if (category != null) {
            return repository.findByCategory(category);
        }
        return repository.findAll();
    }

    public Transaction findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada"));
    }

    public Transaction create(Transaction transaction) {
        return repository.save(transaction);
    }

    public Transaction update(Long id, Transaction data) {
        Transaction existing = findById(id);
        existing.setDescription(data.getDescription());
        existing.setAmount(data.getAmount());
        existing.setCategory(data.getCategory());
        existing.setType(data.getType());
        existing.setDate(data.getDate());
        return repository.save(existing);
    }

    public void delete(Long id) {
        findById(id);
        repository.deleteById(id);
    }
}
