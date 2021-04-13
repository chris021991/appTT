import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss'],
})
export class AvatarSelectorComponent implements OnInit {

  @Output() avatarSel = new EventEmitter<string>();

  avatars = [
    {
      img: '/assets/avatars/av-1.png',
      seleccionado: true
    },
    {
      img: '/assets/avatars/av-2.png',
      seleccionado: false
    },
    {
      img: '/assets/avatars/av-3.png',
      seleccionado: false
    },
    {
      img: '/assets/avatars/av-4.png',
      seleccionado: false
    },
    {
      img: '/assets/avatars/av-5.png',
      seleccionado: false
    },
    {
      img: '/assets/avatars/av-6.png',
      seleccionado: false
    },
    {
      img: '/assets/avatars/av-7.png',
      seleccionado: false
    },
    {
      img: '/assets/avatars/av-8.png',
      seleccionado: false
    },
  ];

  avatarSlide = {
    slidesPerView: 3.5
  };

  constructor() { }

  ngOnInit() {}

  selectAvatar( avatar ){
    this.avatars.forEach( av => av.seleccionado = false );
    avatar.seleccionado = true;

    console.log(avatar.img);
    this.avatarSel.emit( avatar.img );
  }

}
