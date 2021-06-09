import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AtualizarUsuario } from 'src/app/models/AtualizarUsuario';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-atualizar-usuario',
  templateUrl: './atualizar-usuario.component.html',
  styleUrls: ['./atualizar-usuario.component.scss']
})
export class AtualizarUsuarioComponent implements OnInit {
  formulario: any;
  usuarioId: any = localStorage.getItem('UsuarioId');
  emailUsuario: string= '';
  urlFoto!: SafeResourceUrl;
  foto!: File;
  fotoAnterior!: File;
  erros: string[] = [];

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.erros = [];
    this.usuariosService
      .RetornarFotoUsuario(this.usuarioId)
      .subscribe((res) => {
        this.fotoAnterior = res.imagem;
        this.urlFoto = this.sanitizer.bypassSecurityTrustResourceUrl(
          'data:image/png;base64,' + res.imagem
        );
      });

    this.usuariosService
      .PegarUsuarioPeloId(this.usuarioId)
      .subscribe((res) => {
        this.emailUsuario = res.email;

        this.formulario = new FormGroup({
          id: new FormControl(res.id),
          username: new FormControl(res.userName, [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50),
          ]),
          email: new FormControl(res.email, [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(50),
            Validators.email,
          ]),
          cpf: new FormControl(res.cpf, [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(20),
          ]),
          profissao: new FormControl(res.profissao, [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(30),
          ]),
          foto: new FormControl(null),
        });
      });
  }

  get propriedade() {
    return this.formulario.controls;
  }

  SelecionarFoto(fileInput: any): void {
    this.foto = fileInput.target.files[0] as File;

    const reader = new FileReader();
    const fotoElement: any = document.getElementById('foto');

    reader.onload = function (e: any) {
      fotoElement.removeAttribute('hidden');
      fotoElement.setAttribute('src', e.target.result);
    };

    reader.readAsDataURL(this.foto);
  }

  EnviarFormulario(): void {
    const dados = this.formulario.value;

    if (this.foto != null) {
      const formData: FormData = new FormData();
      formData.append('file', this.foto, this.foto.name);

      this.usuariosService.SalvarFoto(formData).subscribe(
        (res) => {
          const atualizarUsuario: AtualizarUsuario = new AtualizarUsuario();
          atualizarUsuario.id = dados.id;
          atualizarUsuario.userName = dados.username;
          atualizarUsuario.cpf = dados.cpf;
          atualizarUsuario.email = dados.email;
          atualizarUsuario.profissao = dados.profissao;
          atualizarUsuario.foto = res.foto;

          this.usuariosService.AtualizarUsuario(atualizarUsuario).subscribe(
            (resposta) => {
              this.router.navigate(['/dashboard/index']);
              this.snackBar.open(resposta.mensagem, undefined, {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
              });
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
        },

        (err) => {
          if (err.status === 400) {
            for (const campo in err.error.errors) {
              if (err.error.errors.hasOwnProperty(campo)) {
                this.erros.push(err.error.errors[campo]);
              }
            }
          }
          if (err.status === 500) {
            this.erros.push('Erro ao tentar salvar a foto');
          }
        }
      );
    } else {
      const atualizarUsuario: AtualizarUsuario = new AtualizarUsuario();
      atualizarUsuario.id = dados.id;
      atualizarUsuario.userName = dados.username;
      atualizarUsuario.cpf = dados.cpf;
      atualizarUsuario.email = dados.email;
      atualizarUsuario.profissao = dados.profissao;
      atualizarUsuario.foto = this.fotoAnterior;

      this.usuariosService.AtualizarUsuario(atualizarUsuario).subscribe(
        (resposta) => {
          this.router.navigate(['/dashboard/index']);
          this.snackBar.open(resposta.mensagem, undefined, {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
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
    }
  }

  Voltar(): void {
    this.router.navigate(['/dashboard/index']);
  }
}
