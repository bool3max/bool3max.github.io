---
title: "Understanding the ELF file structure"
date: 2020-08-09T18:54:26+02:00
draft: true
---

I recently took it upon myself to, at least at the surface level, understand how the ELF ("*Executable and Linkable Format*") works.
In order to do that, I set out to create a tiny python3 module for parsing (meta-)data out of ELF files.

The result of that is [**p3elf**](https://github.com/bool3max/p3elf), during the development of which I familiarized myself with ELF, binary IO in python, as well as `setuptools` and publishing python packages on [PyPI](https://pypi.org/project/p3elf).

This post will mainly serve as a short future reference of the structure of ELF files.

# Structure

The [Executable and Linkable Format](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) Wikipedia article is an excellent reference for the structure and fields of ELF files, though I found it to be a little ambiguous in certain places. 

## File header

Every ELF file begins with a **file header**. It contains general metadata about the binary, and its size is known in advance - it is `64` bytes long on 64bit binaries, and `56` bytes long on 32bit ones.

Notable fields here include: 

* **`EI_CLASS`**: denotes the *byteclass* of the binary (`0x1`: 32bit, `0x2`: 64bit)
    * this field is particularly important because the lengths and offsets of many other fields in the file depend on it
* **`EI_DATA`**: denotes the *endianness* of the binary
    * important for the same reasons as EI_CLASS
* **`EI_OSABI`**: denotes the *ABI*, but is often set to `0x0` (*System V*) regardless of the actual platform
* **`E_TYPE`**: type of object file (executable, relocatable, etc.)
* **`E_MACHINE`**: denotes the target ISA, e.g. `0x3E` for `'amd64'`
* **`E_PHOFF`**, **`E_SHOFF`**, **`E_SHNUM`**, **`E_PHNUM`**, **`E_SHENTSIZE`**, **`E_PHENTSIZE`**
    * offsets, counts, and sizes of **section headers** and **program headers** - more on these later

## Program headers



---

