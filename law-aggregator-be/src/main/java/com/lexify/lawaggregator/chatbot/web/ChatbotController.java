package com.lexify.lawaggregator.chatbot.web;

import com.lexify.lawaggregator.chatbot.dto.ChatbotMessageRequest;
import com.lexify.lawaggregator.chatbot.dto.ChatbotMessageResponse;
import com.lexify.lawaggregator.chatbot.service.ChatbotService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/chatbot")
@CrossOrigin
public class ChatbotController {
  private final ChatbotService chatbotService;

  public ChatbotController(ChatbotService chatbotService) {
    this.chatbotService = chatbotService;
  }

  @PostMapping("/message")
  public ChatbotMessageResponse message(@Valid @RequestBody ChatbotMessageRequest request) {
    return chatbotService.replyTo(request.message(), request.city());
  }
}
