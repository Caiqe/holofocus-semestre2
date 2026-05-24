package school.sptech.slack;

import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Slack {

   private static HttpClient client =  HttpClient.newHttpClient();


   public static void enviarMensagem(String mensagem, String url)throws IOException, InterruptedException {

       JSONObject objeto = new JSONObject();
       objeto.put("text", mensagem);
       HttpRequest request = HttpRequest.newBuilder(URI.create(url))
               .header("accept", "application/json")
               .POST(HttpRequest.BodyPublishers.ofString(objeto.toString()))
               .build();

       HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

       System.out.println(String.format("Status: %s", response.statusCode()));
       System.out.println(String.format("Status: %s", response.body()));

   }

}
