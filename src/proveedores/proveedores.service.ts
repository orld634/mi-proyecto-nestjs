import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProveedoreDto } from '../proveedores/dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';
import { Proveedor } from './entities/proveedore.entity';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedoreDto): Promise<Proveedor> {
    const proveedor = this.proveedorRepository.create(createProveedorDto);
    return await this.proveedorRepository.save(proveedor);
  }

  async findAll(): Promise<Proveedor[]> {
    return await this.proveedorRepository.find();
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({ where: { id } });
    if (!proveedor) {
      throw new NotFoundException(`Proveedor with ID ${id} not found`);
    }
    return proveedor;
  }

  async update(id: number, updateProveedorDto: UpdateProveedoreDto): Promise<Proveedor> {
    const proveedor = await this.findOne(id);
    Object.assign(proveedor, updateProveedorDto);
    return await this.proveedorRepository.save(proveedor);
  }

  async remove(id: number): Promise<void> {
    const proveedor = await this.findOne(id);
    await this.proveedorRepository.remove(proveedor);
  }
}