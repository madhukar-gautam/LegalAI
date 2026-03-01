package com.lexify.lawaggregator.web;
import com.lexify.lawaggregator.repo.LawyerRepo;
import com.lexify.lawaggregator.domain.Lawyer;
import org.springframework.web.bind.annotation.*; import java.util.*; import java.util.stream.*;
@RestController @RequestMapping("/v1/lawyers") @CrossOrigin
public class LawyerController {
  private final LawyerRepo repo;
  public LawyerController(LawyerRepo repo){ this.repo = repo; }
  @GetMapping
  public List<Lawyer> search(@RequestParam(required=false) String city,
                             @RequestParam(required=false) String practice,
                             @RequestParam(required=false) Integer expGte){
    return repo.findAll().stream()
      .filter(l -> city==null || (l.getCity()!=null && l.getCity().equalsIgnoreCase(city)))
      .filter(l -> practice==null || (l.getPracticeAreas()!=null && l.getPracticeAreas().contains(practice)))
      .filter(l -> expGte==null || (l.getYearsExp()!=null && l.getYearsExp()>=expGte))
      .sorted(Comparator.comparing((Lawyer l) -> l.getRatingAvg()==null?0.0:l.getRatingAvg()).reversed())
      .collect(Collectors.toList());
  }
  @GetMapping("/{id}")
  public Lawyer get(@PathVariable Long id){ return repo.findById(id).orElseThrow(); }
}
