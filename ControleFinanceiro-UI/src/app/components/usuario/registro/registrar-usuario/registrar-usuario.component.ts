import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DadosRegistro } from 'src/app/models/DadosRegistro';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.scss']
})
export class RegistrarUsuarioComponent implements OnInit {
  formulario: any;
  foto!: File;
  erros:string[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nomeusuario: new FormControl(null,[Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
      cpf: new FormControl(null,[Validators.required, Validators.minLength(1), Validators.maxLength(20)]),
      profissao: new FormControl(null,[Validators.required, Validators.minLength(1), Validators.maxLength(30)]),
      foto: new FormControl(null,[Validators.required]),
      email: new FormControl(null,[Validators.required, Validators.email,Validators.minLength(10), Validators.maxLength(30)]),
      senha: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50)])
    });
  }

  get propriedade() {
    return this.formulario.controls;
  }

  SelecionarFoto(fileInput: any): void {
    this.foto = fileInput.target.files[0] as File;
    const reader = new FileReader();
    reader.onload = function (e: any) {
      const foto: any = document.getElementById('foto');
      foto.removeAttribute('hidden');
      foto.setAttribute('src', e.target.result);
    };

    reader.readAsDataURL(this.foto);
  }

  EnviarFormulario(): void {
    this.erros = [];
    const usuario = this.formulario.value;
    const formData: FormData = new FormData();

    if (this.foto != null) {
      formData.append('file', this.foto, this.foto.name);
    }

    this.usuariosService.SalvarFoto(formData).subscribe((res) => {
      const dadosRegistro: DadosRegistro = new DadosRegistro();
      dadosRegistro.nomeusuario = usuario.nomeusuario;
      dadosRegistro.cpf = usuario.cpf;
      dadosRegistro.foto = res.foto;
      dadosRegistro.profissao = usuario.profissao;
      dadosRegistro.email = usuario.email;
      dadosRegistro.senha = usuario.senha;

      this.usuariosService.RegistrarUsuario(dadosRegistro).subscribe(
        (dados) => {
          const emailUsuarioLogado = dados.emailUsuarioLogado;
          const usuarioId = dados.usuarioId;
          const tokenUsuarioLogado = dados.tokenUsuarioLogado;
          localStorage.setItem('EmailUsuarioLogado', emailUsuarioLogado);
          localStorage.setItem('UsuarioId', usuarioId);
          localStorage.setItem('TokenUsuarioLogado', tokenUsuarioLogado);
          this.router.navigate(['/categoria/listagem']);
        },
        (err) => {
          if (err.status === 400) {
            for (const campo in err.error.errors) {
              if (err.error.errors.hasOwnProperty(campo)) {
                this.erros.push(err.error.errors[campo]);
              }
            }
          }
        }
      );
    });
  }

}
