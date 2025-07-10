import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    try {
      const proveedor = this.proveedorRepository.create(createProveedorDto);
      return await this.proveedorRepository.save(proveedor);
    } catch (error) {
      if (error.code === '23505') {
        if (error.constraint?.includes('email')) {
          throw new ConflictException('El email ya está registrado');
        }
        if (error.constraint?.includes('ruc_nit')) {
          throw new ConflictException('El RUC/NIT ya está registrado');
        }
        throw new ConflictException('Ya existe un proveedor con esos datos');
      }
      throw error;
    }
  }

  async findAll(): Promise<Proveedor[]> {
    return await this.proveedorRepository.find({
      where: { activo: true },
      order: { nombre_empresa: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({
      where: { id_proveedor: id, activo: true }
    });
    
    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }
    
    return proveedor;
  }

  async findByEmail(email: string): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({
      where: { email, activo: true }
    });
    
    if (!proveedor) {
      throw new NotFoundException(`Proveedor con email ${email} no encontrado`);
    }
    
    return proveedor;
  }

  async findByRucNit(rucNit: string): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({
      where: { ruc_nit: rucNit, activo: true }
    });
    
    if (!proveedor) {
      throw new NotFoundException(`Proveedor con RUC/NIT ${rucNit} no encontrado`);
    }
    
    return proveedor;
  }

  async findByPais(pais: string): Promise<Proveedor[]> {
    return await this.proveedorRepository.find({
      where: { pais: Like(`%${pais}%`), activo: true },
      order: { nombre_empresa: 'ASC' }
    });
  }

  async searchByNombre(nombre: string): Promise<Proveedor[]> {
    return await this.proveedorRepository.find({
      where: { 
        nombre_empresa: Like(`%${nombre}%`), 
        activo: true 
      },
      order: { nombre_empresa: 'ASC' }
    });
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto): Promise<Proveedor> {
    const proveedor = await this.findOne(id);
    
    try {
      Object.assign(proveedor, updateProveedorDto);
      return await this.proveedorRepository.save(proveedor);
    } catch (error) {
      if (error.code === '23505') {
        if (error.constraint?.includes('email')) {
          throw new ConflictException('El email ya está registrado');
        }
        if (error.constraint?.includes('ruc_nit')) {
          throw new ConflictException('El RUC/NIT ya está registrado');
        }
        throw new ConflictException('Ya existe un proveedor con esos datos');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const proveedor = await this.findOne(id);
    proveedor.activo = false;
    await this.proveedorRepository.save(proveedor);
  }

  async hardDelete(id: number): Promise<void> {
    const resultado = await this.proveedorRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }
  }

  async activate(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({
      where: { id_proveedor: id }
    });
    
    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }
    
    proveedor.activo = true;
    return await this.proveedorRepository.save(proveedor);
  }
}