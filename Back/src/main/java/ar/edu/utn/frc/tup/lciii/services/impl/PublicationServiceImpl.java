package ar.edu.utn.frc.tup.lciii.services.impl;

import ar.edu.utn.frc.tup.lciii.dtos.*;
import ar.edu.utn.frc.tup.lciii.dtos.requests.CalificationRequest;
import ar.edu.utn.frc.tup.lciii.dtos.requests.PublicationRequest;
import ar.edu.utn.frc.tup.lciii.dtos.requests.SearchPubRequest;
import ar.edu.utn.frc.tup.lciii.dtos.requests.SectionRequest;
import ar.edu.utn.frc.tup.lciii.entities.CalificationEntity;
import ar.edu.utn.frc.tup.lciii.entities.PublicationEntity;
import ar.edu.utn.frc.tup.lciii.entities.SectionEntity;
import ar.edu.utn.frc.tup.lciii.entities.UserEntity;
import ar.edu.utn.frc.tup.lciii.enums.Difficulty;
import ar.edu.utn.frc.tup.lciii.enums.TypePub;
import ar.edu.utn.frc.tup.lciii.enums.TypeSec;
import ar.edu.utn.frc.tup.lciii.repository.CalificationRepository;
import ar.edu.utn.frc.tup.lciii.repository.PublicationRepository;
import ar.edu.utn.frc.tup.lciii.repository.SectionRepository;
import ar.edu.utn.frc.tup.lciii.repository.UserRepository;
import ar.edu.utn.frc.tup.lciii.services.PublicationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

@Service
public class PublicationServiceImpl implements PublicationService {
    @Autowired
    PublicationRepository publicationRepository;
    @Autowired
    SectionRepository sectionRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    CalificationRepository calificationRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    ObjectMapper objectMapper;

    @Value("${app.url}")
    private String url;

    @Override
    @Transactional
    public PublicationDto register(PublicationRequest request) {

        PublicationEntity publication = modelMapper.map(request, PublicationEntity.class);
        publication.setUser(userRepository.getReferenceById(request.getUser()));
        publicationRepository.save(publication);

        List<SectionEntity> sectionEntities = new ArrayList<>();
        for (SectionRequest sectionDto : request.getSections()) {
            SectionEntity s = modelMapper.map(sectionDto, SectionEntity.class);
            s.setPublication(publication);

            sectionEntities.add(sectionRepository.save(s));
        }
        publication.setSections(sectionEntities);


        return get(publication.getId(),1l);
    }

    @Override
    @Transactional
    public boolean registerImg(MultipartFile[] images, String indexes) throws IOException {

        int i=0;
        for (String c : indexes.split("_")) {
            Long id = Long.parseLong(c);
            SectionEntity s = sectionRepository.getReferenceById(id);
            s.setImage(compressBytes(images[i].getBytes()));
            sectionRepository.save(s);
            i++;
        }

        return true;
    }

    @Override
    public boolean calificate(CalificationRequest request){
        PublicationEntity p = publicationRepository.getReferenceById(request.getPubId());
        UserEntity u = userRepository.getReferenceById(request.getUserId());
        Optional<CalificationEntity> calificationAsk = calificationRepository.getByUserAndPublication(u,p);
        CalificationEntity calification;
        if(calificationAsk.isEmpty()){
            calification=new CalificationEntity();
            calification.setPublication(p);
            calification.setUser(u);
        }else {
            calification=calificationAsk.get();
        }

        calification.setPoints(request.getValue());
        calificationRepository.save(calification);

        return true;
    }
    //Listar
    @Override
    public List<PublicationMinDto> getAll() {
        List<PublicationEntity> list = publicationRepository.findAll();
        return modelMapper.map(list, new TypeToken<List<PublicationMinDto>>() {
        }.getType());
    }

    @Override
    public SearchPubResponce getAllFilthered(SearchPubRequest searchPubRequest) {

        SearchPubResponce responce = new SearchPubResponce();


        List<PublicationEntity> all = publicationRepository.findAll();

        List<PublicationMinDto> list = new ArrayList<>();
        for (PublicationEntity p : all) {
            if(p.isDeleted()){
                continue;
            }

            if(searchPubRequest.getType()!=TypePub.NONE){
                if(searchPubRequest.getType()!=p.getType()){
                    continue;
                }
            }
            if(p.getDifficulty()< searchPubRequest.getDiffMin() || p.getDifficulty()> searchPubRequest.getDiffMax()){
                continue;
            }
            BigDecimal cal = calificationList(p);
            if(cal.compareTo(searchPubRequest.getPoints())<0){
                continue;
            }
            if(!searchPubRequest.getText().isBlank()){
                if(!p.getDescription().contains(searchPubRequest.getText())
                || !p.getName().contains(searchPubRequest.getText())){
                    continue;
                }
            }

            PublicationMinDto dto = modelMapper.map(p, PublicationMinDto.class);

            dto.setCalification(cal);
            SectionEntity sectionImage = sectionRepository.findFirstByPublicationAndType(p,TypeSec.PHOTO);
            dto.setDificulty(Difficulty.values()[p.getDifficulty()].name());
            if (sectionImage != null) {
                dto.setImageUrl(url + "/api/image/pub/" + sectionImage.getId());
            }
            list.add(dto);
        }

        int firstIndex= searchPubRequest.getPage()* searchPubRequest.getSize();
        firstIndex=Integer.min(firstIndex, list.size());

        int lastIndex= firstIndex + searchPubRequest.getSize();
        lastIndex=Integer.min(lastIndex, list.size());

        responce.setList(list.subList(firstIndex,lastIndex));

        responce.setCountTotal(list.size());

        return responce;
    }



    BigDecimal calificationList(PublicationEntity p){
        List<CalificationEntity> list = calificationRepository.findAllByPublication(p);
        if(list.size()>0){
            BigDecimal value=BigDecimal.ZERO;
            int count=0;
            for (CalificationEntity c:list){
                value= value.add(c.getPoints());
                count++;
            }
            return value.divide(BigDecimal.valueOf(count));
        }
        return BigDecimal.ZERO;
    }

    @Override
    public PublicationDto get(Long id, Long userId) throws EntityNotFoundException {
        PublicationDto responce;
        PublicationEntity p = publicationRepository.getReferenceById(id);
        if (p == null) {
            throw new EntityNotFoundException();
        }

        responce = modelMapper.map(p, PublicationDto.class);

        List<SectionDto> sections = new ArrayList<>();
        for (SectionEntity s : sectionRepository.findAllByPublication(p)) {
            SectionDto r = modelMapper.map(s, SectionDto.class);
            if (s.getImage() != null) {
                r.setImageUrl(url + "/api/image/pub/" + r.getId());
            }
            sections.add(r);
        }
        responce.setUserId(p.getUser().getId());
        responce.setUsername(p.getUser().getUsername());
        responce.setUserIconUrl(url + "/api/image/user/" + p.getUser().getId());
        responce.setCalification(calificationList(p).toString());
        responce.setDifficulty(Difficulty.values()[p.getDifficulty()].name());
        Optional<CalificationEntity> calificationEntity =
                calificationRepository.getByUserAndPublication(userRepository.getReferenceById(userId),p);
        if(calificationEntity.isPresent()){
            responce.setMyCalification(calificationEntity.get().getPoints().toString());
        }else {
            responce.setMyCalification("0");
        }

        responce.setSections(sections);

        return responce;
    }

    @Override
    public byte[] getImage(Long id) {

        SectionEntity s = sectionRepository.getReferenceById(id);
        if (s == null) {
            throw new EntityNotFoundException();
        }

        return decompressBytes(s.getImage());
    }

    // compress the image bytes before storing it in the database
    public static byte[] compressBytes(byte[] data) {
        Deflater deflater = new Deflater();
        deflater.setInput(data);
        deflater.finish();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        while (!deflater.finished()) {
            int count = deflater.deflate(buffer);
            outputStream.write(buffer, 0, count);
        }
        try {
            outputStream.close();
        } catch (IOException e) {
        }
//        System.out.println("From" + data.length);
//        System.out.println("Compressed Image Byte Size - " + outputStream.toByteArray().length);

        return outputStream.toByteArray();
    }

    // uncompress the image bytes before returning it to the angular application
    public static byte[] decompressBytes(byte[] data) {
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        try {
            while (!inflater.finished()) {
                int count = inflater.inflate(buffer);
                outputStream.write(buffer, 0, count);
            }
            outputStream.close();
        } catch (IOException ioe) {
        } catch (DataFormatException e) {
        }
        return outputStream.toByteArray();
    }

    @Override
    public boolean delete(Long id) {
        PublicationEntity p = publicationRepository.getReferenceById(id);
        p.setDeleted(true);
        publicationRepository.save(p);
        return true;
    }
}
