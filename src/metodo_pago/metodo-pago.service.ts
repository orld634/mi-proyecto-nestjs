// src/metodo-pago/metodo-pago.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';
import { MetodoPago } from './entities/metodo-pago.entity';

@Injectable()
export class MetodoPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private readonly metodoPagoRepository: Repository<MetodoPago>,
  ) {}

  async create(createMetodoPagoDto: CreateMetodoPagoDto): Promise<MetodoPago> {
    const existe = await this.metodoPagoRepository.findOne({
      where: { nombre: createMetodoPagoDto.nombre.trim() },
    });

    if (existe) {
      throw new BadRequestException(`Ya existe un método de pago llamado "${createMetodoPagoDto.nombre}"`);
    }

    const metodo = this.metodoPagoRepository.create({
      ...createMetodoPagoDto,
      activo: createMetodoPagoDto.activo ?? true,
    });

    return this.metodoPagoRepository.save(metodo);
  }

  async findAll(activosSolo: boolean = true): Promise<MetodoPago[]> {
    const query = this.metodoPagoRepository.createQueryBuilder('metodo');

    if (activosSolo) {
      query.where('metodo.activo = :activo', { activo: true });
    }

    return query.orderBy('metodo.nombre', 'ASC').getMany();
  }

  async findOne(id: number): Promise<MetodoPago> {
    const metodo = await this.metodoPagoRepository.findOneBy({ id_metodo_pago: id });

    if (!metodo) {
      throw new NotFoundException(`Método de pago con ID ${id} no encontrado`);
    }

    return metodo;
  }

  async update(id: number, updateMetodoPagoDto: UpdateMetodoPagoDto): Promise<MetodoPago> {
    const metodo = await this.findOne(id);

    // Evitar duplicados de nombre si se está actualizando
    if (updateMetodoPagoDto.nombre) {
      const existe = await this.metodoPagoRepository.findOne({
        where: { nombre: updateMetodoPagoDto.nombre.trim(), id_metodo_pago: (id) },
      });

      if (existe) {
        throw new BadRequestException(`Ya existe otro método de pago llamado "${updateMetodoPagoDto.nombre}"`);
      }
    }

    Object.assign(metodo, updateMetodoPagoDto);
    return this.metodoPagoRepository.save(metodo);
  }

  async remove(id: number): Promise<void> {
    const metodo = await this.findOne(id);
    await this.metodoPagoRepository.remove(metodo);
  }

  // Soft delete (más recomendado en producción)
  async desactivar(id: number): Promise<MetodoPago> {
    const metodo = await this.findOne(id);
    metodo.activo = false;
    return this.metodoPagoRepository.save(metodo);
  }
}