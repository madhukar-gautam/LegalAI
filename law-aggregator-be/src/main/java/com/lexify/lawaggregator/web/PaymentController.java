package com.lexify.lawaggregator.web;
import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestController @RequestMapping("/v1/payments") @CrossOrigin
public class PaymentController {
  @PostMapping("/checkout")
  public Map<String,Object> checkout(@RequestBody Map<String,Object> body){
    return Map.of("status","ok","provider","stub","amount", body.getOrDefault("amount", 0));
  }
  @PostMapping("/webhook")
  public Map<String,Object> webhook(@RequestBody Map<String,Object> event){
    return Map.of("received", true);
  }
}
