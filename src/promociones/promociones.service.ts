// src/promociones/promociones.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CreatePromocionDto } from '../promociones/dto/create-promocione.dto';
import { UpdatePromocionDto } from '../promociones/dto/update-promocione.dto';
import { Promocion } from './entities/promocione.entity';

@Injectable()
export class PromocionesService {
  constructor(
    @InjectRepository(Promocion)
    private readonly promocionRepository: Repository<Promocion>,
  ) {}

  async create(createPromocionDto: CreatePromocionDto): Promise<Promocion> {
    const inicio = new Date(createPromocionDto.fecha_inicio);
    const fin = new Date(createPromocionDto.fecha_fin);

    if (inicio >= fin) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
    }

    const promocion = this.promocionRepository.create({
      ...createPromocionDto,
      activo: createPromocionDto.activo ?? true,
    });

    return this.promocionRepository.save(promocion);
  }

  // ← relations: ['producto'] agregado para traer imagen y datos del producto
  async findAll(): Promise<Promocion[]> {
    return this.promocionRepository.find({
      relations: ['producto'],
      order: { fecha_inicio: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Promocion> {
    const promocion = await this.promocionRepository.findOne({
      where: { id_promocion: id },
      relations: ['producto'],
    });

    if (!promocion) {
      throw new NotFoundException(`Promoción con ID ${id} no encontrada`);
    }

    return promocion;
  }

  // ← relations: ['producto'] agregado también aquí
  async findActivas(): Promise<Promocion[]> {
    const hoy = new Date();
    return this.promocionRepository.find({
      where: {
        activo: true,
        fecha_inicio: LessThanOrEqual(hoy),
        fecha_fin: MoreThanOrEqual(hoy),
      },
      relations: ['producto'],
      order: { fecha_fin: 'ASC' },
    });
  }

  async update(id: number, updatePromocionDto: UpdatePromocionDto): Promise<Promocion> {
    const promocion = await this.findOne(id);

    if (updatePromocionDto.fecha_inicio || updatePromocionDto.fecha_fin) {
      const inicio = new Date(updatePromocionDto.fecha_inicio ?? String(promocion.fecha_inicio));
      const fin = new Date(updatePromocionDto.fecha_fin ?? String(promocion.fecha_fin));

      if (inicio >= fin) {
        throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
      }
    }

    Object.assign(promocion, updatePromocionDto);
    return this.promocionRepository.save(promocion);
  }

  async remove(id: number): Promise<void> {
    const promocion = await this.findOne(id);
    await this.promocionRepository.remove(promocion);
  }

  async desactivar(id: number): Promise<Promocion> {
    const promocion = await this.findOne(id);
    promocion.activo = false;
    return this.promocionRepository.save(promocion);
  }
}