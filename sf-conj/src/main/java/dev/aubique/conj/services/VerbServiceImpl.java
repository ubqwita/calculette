package dev.aubique.conj.services;

import dev.aubique.conj.exceptions.ResourceNotFoundException;
import dev.aubique.conj.model.VerbMax;
import dev.aubique.conj.repository.VerbRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VerbServiceImpl {

    @Autowired
    private VerbRepository repo;

    @Autowired
    private ParserService parser;

    public VerbMax getVerbById(Long verbId) {
        return repo.findById(verbId).get();
    }

    public VerbMax getVerbMax(String verbName) throws ResourceNotFoundException {
        return doInternalSearch(verbName)
                .or(() -> doExternalSearch(verbName))
                .orElseThrow(ResourceNotFoundException::new);
    }

    private Optional<VerbMax> doInternalSearch(String name) {
        return repo.findVerbByName(name);
    }

    private Optional<VerbMax> doExternalSearch(String name) {
        final VerbMax verbObj = parser.getParsedVerb(name);

        if (verbObj == null)
            return Optional.empty();

        saveVerb(verbObj);
        return doInternalSearch(verbObj.getName());
//        return Optional.of(verbObj);
    }

    public void saveVerb(VerbMax verbObj) {
        repo.save(verbObj);
    }
}
