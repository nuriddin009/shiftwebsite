package com.example.backend.dto;

import com.example.backend.entity.shift.AboutComponent;
import com.example.backend.entity.shift.Course;
import com.example.backend.entity.shift.TitleComponent;
import com.example.backend.entity.shift.WhyUS;
import com.example.backend.entity.shift.Gallery;
import com.example.backend.entity.shift.OurTeam;
import com.example.backend.entity.shift.Address;
import com.example.backend.entity.shift.FollowUs;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Shift {

    private AboutComponent about;
    private TitleComponent title;
    private List<WhyUS> whyUses;
    private List<Course> courses;
    private List<Gallery> galleries;
    private List<OurTeam> ourTeams;
    private Address address;
    private List<FollowUs> followUses;

}
