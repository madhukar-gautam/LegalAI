package com.lexify.lawaggregator.web;
import com.lexify.lawaggregator.dto.TriageRequest; import com.lexify.lawaggregator.dto.TriageResponse;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/v1/intake") @CrossOrigin
public class IntakeController {
  @PostMapping("/triage")
  public TriageResponse triage(@RequestBody TriageRequest req){
    String text = (req.description()==null? "" : req.description().toLowerCase());
    String label = "General";
    if (text.contains("divorce") || text.contains("maintenance") || text.contains("custody")) label="Family";
    else if (text.contains("property") || text.contains("rent") || text.contains("possession")) label="Property";
    else if (text.contains("cheque") || text.contains("498a") || text.contains("fir") || text.contains("bail")) label="Criminal";
    else if (text.contains("contract") || text.contains("nda") || text.contains("startup") || text.contains("saas")) label="Corporate";
    else if (text.contains("trademark") || text.contains("copyright") || text.contains("patent")) label="IP";
    else if (text.contains("gst") || text.contains("tax")) label="Tax";
    return new TriageResponse(label);
  }
}
