<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AppController;

// Tela principal
Route::get("/home", [AppController::class, 'home'])->name('home');

// Tela do dashboard
Route::match(['get', 'post'], "/dashboard", [AppController::class, 'dashboard'])->name('dashboard');

// Tela do cadastro do usuário
Route::match(['get', 'post'], "/cadastro", [AppController::class, 'cadastro'])->name('cadastro');

// Tela de login do usuário
Route::match(['get', 'post'], "/login", [AppController::class, 'login'])->name('login');

// Tela para inclusão de dívidas
Route::match(['get', 'post'], "/cadastrar_divida", [AppController::class, 'cadastrar_divida'])->name('cadastrar_divida');

// Tela para inclusão de movimentações no extrato
Route::match(['get', 'post'], "/cadastrar_extrato", [AppController::class, 'cadastrar_extrato'])->name('cadastrar_extrato');

// Tela para inclusão de gastos
Route::match(['get', 'post'], "/cadastrar_gasto", [AppController::class, 'cadastrar_gasto'])->name('cadastrar_gasto');

// Tela para incluir investimentos
Route::match(['get', 'post'], "/cadastrar_investimento", [AppController::class, 'cadastrar_investimento'])->name('cadastrar_investimento');

// Tela para incluir metas
Route::match(['get', 'post'], "/cadastrar_meta", [AppController::class, 'cadastrar_meta'])->name('cadastrar_meta');

// Tela para incluir renda
Route::match(['get', 'post'], "/cadastrar_renda", [AppController::class, 'cadastrar_renda'])->name('cadastrar_renda');

// Tela para visualizar extrato
Route::match (['get', 'post'], "/extrato", [AppController::class, 'extrato'])->name('extrato');

// Tela para visualizar rendas
Route::match (['get', 'post'], "/renda", [AppController::class, 'renda'])->name('renda');

// Tela para visualizar gastos
Route::match (['get', 'post'], "/gasto", [AppController::class, 'gasto'])->name('gasto');

// Tela para visualizar dividas
Route::match (['get', 'post'], "/divida", [AppController::class, 'divida'])->name('divida');

// Tela para visualizar metas
Route::match (['get', 'post'], "/meta", [AppController::class, 'meta'])->name('meta');

// Tela para visualizar investimentos
Route::match (['get', 'post'], "/investimento", [AppController::class, 'investimento'])->name('investimento');
?>
