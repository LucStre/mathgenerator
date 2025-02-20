"""
.. include:: ../README.md
"""

from .algebra import *
from .basic_math import *
from .calculus import *
from .computer_science import *
from .geometry import *
from .misc import *
from .statistics import *

from ._gen_list import gen_list


# [funcname, subjectname]
def get_gen_list():
    return gen_list


def gen_by_id(id, *args, **kwargs):
    return get_by_id(id)(*args, **kwargs)


def get_by_id(id):
    return globals()[gen_list[id][0]]


# Legacy Functions
def getGenList():
    return get_gen_list()


def genById(id, *args, **kwargs):
    return gen_by_id(id, *args, **kwargs)
