package com.example.backend.service.studyCenter;

import com.example.backend.entity.Certificate;
import com.example.backend.repository.studyCenter.CertificateRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.font.GlyphVector;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class GenerateCertificate {

    private final CertificateRepository certificateRepository;
    private final ResourceLoader resourceLoader;


    @SneakyThrows
    public byte[] generateStudentCertificate(UUID uuid,
                                             byte[] userImage, String firstName,
                                             String lastName,
                                             String studyType,
                                             String description
    ) {

        Resource resource3 = new ClassPathResource("static/backend/images/certificate.jpg");
        InputStream inputStream3 = resource3.getInputStream();


        Resource resource1 = new ClassPathResource("static/fonts/medium.ttf");
        InputStream inputStream1 = resource1.getInputStream();


        Resource resource2 = new ClassPathResource("static/fonts/regular.ttf");
        InputStream inputStream2 = resource2.getInputStream();


        Resource resource4 = new ClassPathResource("static/fonts/medium.ttf");
        InputStream inputStream4 = resource4.getInputStream();


        Font studyTypeFont = Font.createFont(Font.TRUETYPE_FONT, inputStream1).deriveFont(190.6f);
        Font studentNameFont = Font.createFont(Font.TRUETYPE_FONT, inputStream4).deriveFont(350.6f);
        Font descFont = Font.createFont(Font.TRUETYPE_FONT, inputStream2).deriveFont(150f);


        Color studentNameColor = new Color(0, 0, 0);
        Color studyTypeColor = new Color(255, 255, 255);
        Color descColor = new Color(1, 1, 1);


        final BufferedImage image = ImageIO.read(inputStream3);
        Graphics2D g = image.createGraphics();


        g.setFont(studyTypeFont);
        g.setColor(studyTypeColor);
        g.drawString("OF «" + studyType + "»", 375, 1100);

        g.setColor(studentNameColor);
        g.setFont(studentNameFont);

        FontMetrics ruler = g.getFontMetrics(studentNameFont);
        GlyphVector vector = studentNameFont.createGlyphVector(
                ruler.getFontRenderContext(), firstName + " " + lastName);

        Shape outline = vector.getOutline(0, 0);

        double expectedWidth = outline.getBounds().getWidth();
        double expectedHeight = outline.getBounds().getHeight();
        g.drawString(firstName + " " + lastName, (int) (6649 - expectedWidth), 3040);


        //x:6649

        g.setFont(descFont);
        g.setColor(descColor);


        drawString(g, description, 6649, 3240, descFont, firstName, lastName);


        g.dispose();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix bitMatrix = null;
        bitMatrix = writer.encode("https://shiftacademy.uz/checkCertificateQr/" + uuid, BarcodeFormat.QR_CODE,
                500, 500, null);
        BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix, getMatrixConfig());


        ByteArrayOutputStream baos1 = new ByteArrayOutputStream();
        ImageIO.write(qrImage, "png", baos1);
        byte[] qrBytes = baos1.toByteArray();

        Certificate certificate = certificateRepository.findById(uuid).get();
        certificate.setQrCode(qrBytes);
        certificateRepository.save(certificate);

        Graphics2D graphics = image.createGraphics();
        graphics.drawImage(qrImage, 445, 3885, null);


        Graphics2D avatar = image.createGraphics();
        BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(userImage));
        Image scaledImage = bufferedImage.getScaledInstance(1124, 1124, Image.SCALE_SMOOTH);
        BufferedImage imageBuff = new BufferedImage(1124, 1124, BufferedImage.TYPE_INT_ARGB);


//        Graphics graphics1 = imageBuff.getGraphics();
        Graphics2D graphics2 = imageBuff.createGraphics();
        graphics2.setComposite(AlphaComposite.Src);
        graphics2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        graphics2.setColor(Color.WHITE);
        graphics2.fill(new RoundRectangle2D.Float(0, 0, 1124, 1124, 1124, 1124));
        graphics2.setComposite(AlphaComposite.SrcAtop);
        graphics2.drawImage(scaledImage, 0, 0, new Color(255, 255, 255), null);

        avatar.drawImage(imageBuff, 463, 1530, null);

        ImageIO.write(image, "jpg", baos);
        return baos.toByteArray();
    }

    private MatrixToImageConfig getMatrixConfig() {
        // ARGB Colors
        // Check Colors ENUM
        return new MatrixToImageConfig(Colors.BLACK.getArgb(), Colors.TRANSPARENT.getArgb());
    }

    private void drawString(Graphics g, String text, int x, int y, Font font, String firstName, String lastName) {

        for (String line : text.split("\n")) {
            line = line.contains("***") ? line.replace("***", firstName + " " + lastName) : line;
            FontMetrics ruler = g.getFontMetrics(font);
            GlyphVector vector = font.createGlyphVector(
                    ruler.getFontRenderContext(), line);

            Shape outline = vector.getOutline(0, 0);

            double expectedWidth = outline.getBounds().getWidth();
            double expectedHeight = outline.getBounds().getHeight();

            g.drawString(line, (int) (x - expectedWidth), y += 1.5 * g.getFontMetrics().getHeight());
        }
    }

    public enum Colors {

        BLUE(0xFF40BAD0),
        RED(0xFFE91C43),
        PURPLE(0xFF8A4F9E),
        ORANGE(0xFFF4B13D),
        WHITE(0xFFFFFFFF),
        BLACK(0xFF000000),
        TRANSPARENT(0x00FFFFFF);

        private final int argb;

        Colors(final int argb) {
            this.argb = argb;
        }

        public int getArgb() {
            return argb;
        }
    }


}
